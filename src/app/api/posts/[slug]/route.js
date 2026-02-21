import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import slugify from "slugify";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import fs from "fs/promises";
import path from "path";
import { DEFAULT_SITE_ID, resolveSiteId } from "@/lib/site";
import {
  ADMIN_ROLES,
  can,
  normalizeAdminRole,
  POST_EDITING_POLICIES,
} from "@/lib/adminPermissions";

function getSiteIdForSession(session, requestedSiteId = null) {
  return resolveSiteId(session?.user?.siteId, requestedSiteId);
}

function normalizeEditingPolicy(value) {
  const normalized = String(value || "").trim().toUpperCase();
  if (normalized in POST_EDITING_POLICIES) return normalized;
  return null;
}

function didFieldChange(field, data, existingPost) {
  if (!(field in data)) return false;
  if (field === "categoryId") return Number(data.categoryId) !== existingPost.categoryId;
  return data[field] !== existingPost[field];
}

function isSuperAdmin(role) {
  return normalizeAdminRole(role) === ADMIN_ROLES.SUPER_ADMIN;
}

let editingPolicyFieldSupported;
async function supportsEditingPolicyField() {
  if (editingPolicyFieldSupported !== undefined) return editingPolicyFieldSupported;
  try {
    await prisma.post.count({
      where: { editingPolicy: POST_EDITING_POLICIES.OWNER_ONLY },
    });
    editingPolicyFieldSupported = true;
  } catch (error) {
    const msg = String(error?.message || "");
    if (
      msg.includes("Unknown argument `editingPolicy`") ||
      msg.includes("column `Post.editingPolicy` does not exist") ||
      msg.includes("does not exist in the current database")
    ) {
      editingPolicyFieldSupported = false;
    } else {
      throw error;
    }
  }
  return editingPolicyFieldSupported;
}

function toPublicImagePath(imagePath) {
  if (!imagePath || typeof imagePath !== "string") return null;
  if (imagePath.startsWith("http")) return null;
  const clean = imagePath.replace(/^\/+/, "");
  if (!clean.startsWith("uploads/")) return null;
  return clean;
}

async function deleteLocalImage(imagePath) {
  const relPath = toPublicImagePath(imagePath);
  if (!relPath) return;

  const publicRoot = path.resolve(process.cwd(), "public");
  const filePath = path.resolve(publicRoot, relPath);

  if (!filePath.startsWith(publicRoot)) return;

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error?.code !== "ENOENT") {
      console.error(`Failed to delete image "${filePath}"`, error);
    }
  }
}

export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const adminMode = searchParams.get("admin") === "true";
    const siteId = searchParams.get("siteId") || DEFAULT_SITE_ID;

    if (!slug) {
      return NextResponse.json({ error: "Slug required" }, { status: 400 });
    }

    if (adminMode && !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where = adminMode && session ? { slug, siteId } : { slug, siteId, published: true };
    const policySupported = await supportsEditingPolicyField();
    const postSelect = {
      id: true,
      siteId: true,
      title: true,
      slug: true,
      shortDesc: true,
      content: true,
      metaTitle: true,
      metaDesc: true,
      ogTitle: true,
      ogDesc: true,
      ogImage: true,
      canonical: true,
      mainImage: true,
      images: true,
      categoryId: true,
      authorId: true,
      published: true,
      featured: true,
      createdAt: true,
      updatedAt: true,
      category: { select: { id: true, name: true, slug: true } },
      author: { select: { id: true, name: true, role: true } },
      ...(policySupported ? { editingPolicy: true } : {}),
    };

    const post = await prisma.post.findFirst({
      where,
      select: postSelect,
    });

    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    if (adminMode && session && !can(session.user?.role, "canPublishPost")) {
      const isOwner = post.authorId === session.user.id;
      const isSharedSuperAdminPost =
        policySupported &&
        post.author?.role === ADMIN_ROLES.SUPER_ADMIN &&
        post.editingPolicy === POST_EDITING_POLICIES.SUPER_ADMIN_CONTENT_ONLY;
      if (!isOwner && !isSharedSuperAdminPost) {
        return NextResponse.json({ error: "Forbidden: editors can access only allowed posts" }, { status: 403 });
      }
    }

    const responsePost = {
      ...post,
      author: post.author ? { id: post.author.id, name: post.author.name } : null,
    };

    return NextResponse.json(responsePost);
  } catch {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const canEditPost = can(session.user?.role, "canEditPost");
    const canPublishPost = can(session.user?.role, "canPublishPost");
    if (!canEditPost && !canPublishPost) {
      return NextResponse.json({ error: "Forbidden: role cannot edit posts" }, { status: 403 });
    }

    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const siteId = getSiteIdForSession(session, searchParams.get("siteId"));
    if (!siteId) return NextResponse.json({ error: "siteId required" }, { status: 400 });
    const policySupported = await supportsEditingPolicyField();

    const data = await req.json();
    const existingPost = await prisma.post.findFirst({
      where: { slug, siteId },
      select: {
        id: true,
        slug: true,
        title: true,
        shortDesc: true,
        content: true,
        mainImage: true,
        ogImage: true,
        metaTitle: true,
        metaDesc: true,
        categoryId: true,
        authorId: true,
        published: true,
        featured: true,
        ...(policySupported ? { editingPolicy: true } : {}),
        author: { select: { id: true, role: true } },
      },
    });

    if (!existingPost) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    const isOwner = existingPost.authorId === session.user.id;
    const isSharedSuperAdminPost =
      policySupported &&
      existingPost.author?.role === ADMIN_ROLES.SUPER_ADMIN &&
      existingPost.editingPolicy === POST_EDITING_POLICIES.SUPER_ADMIN_CONTENT_ONLY;
    if (!canPublishPost && !isOwner && !isSharedSuperAdminPost) {
      return NextResponse.json({ error: "Forbidden: editors can edit only own/allowed posts" }, { status: 403 });
    }

    const contentFields = [
      "title",
      "slug",
      "shortDesc",
      "content",
      "mainImage",
      "ogImage",
      "metaTitle",
      "metaDesc",
      "categoryId",
    ];
    const hasContentUpdate = contentFields.some((field) => didFieldChange(field, data, existingPost));
    const hasPublishUpdate =
      didFieldChange("published", data, existingPost) || didFieldChange("featured", data, existingPost);

    if (hasContentUpdate && !canEditPost) {
      return NextResponse.json({ error: "Forbidden: role cannot edit post content" }, { status: 403 });
    }
    if (hasPublishUpdate && !canPublishPost) {
      return NextResponse.json({ error: "Forbidden: role cannot publish/feature posts" }, { status: 403 });
    }

    if (!canPublishPost && !isOwner && isSharedSuperAdminPost) {
      const changedRestrictedFields = contentFields.filter(
        (field) => field !== "content" && didFieldChange(field, data, existingPost)
      );
      if (
        changedRestrictedFields.length > 0 ||
        hasPublishUpdate ||
        (policySupported && didFieldChange("editingPolicy", data, existingPost))
      ) {
        return NextResponse.json(
          { error: "Forbidden: this shared post allows content-only edits" },
          { status: 403 }
        );
      }
    }

    let nextEditingPolicy = existingPost.editingPolicy;
    if ("editingPolicy" in data) {
      if (!policySupported) {
        return NextResponse.json(
          { error: "Editing policy is not available until Prisma schema/client are updated" },
          { status: 400 }
        );
      }
      if (!isSuperAdmin(session.user?.role)) {
        return NextResponse.json({ error: "Forbidden: only super admin can change edit policy" }, { status: 403 });
      }
      const normalizedPolicy = normalizeEditingPolicy(data.editingPolicy);
      if (!normalizedPolicy) {
        return NextResponse.json({ error: "Invalid editing policy" }, { status: 400 });
      }
      nextEditingPolicy = normalizedPolicy;
    }

    let newSlug = existingPost.slug;
    if (didFieldChange("slug", data, existingPost)) {
      newSlug = slugify(data.slug, { lower: true, strict: true });
      const conflict = await prisma.post.findFirst({
        where: { slug: newSlug, siteId },
        select: { id: true },
      });
      if (conflict) newSlug = `${newSlug}-${Date.now()}`;
    }

    const updateData = {
      title: data.title ?? existingPost.title,
      slug: newSlug,
      shortDesc: data.shortDesc ?? existingPost.shortDesc,
      content: data.content ?? existingPost.content,
      mainImage: data.mainImage ?? existingPost.mainImage,
      ogImage: data.ogImage ?? existingPost.ogImage,
      metaTitle: data.metaTitle ?? existingPost.metaTitle,
      metaDesc: data.metaDesc ?? existingPost.metaDesc,
      categoryId:
        data.categoryId !== undefined && data.categoryId !== null && data.categoryId !== ""
          ? Number(data.categoryId)
          : existingPost.categoryId,
      published: data.published ?? existingPost.published,
      featured: data.featured ?? existingPost.featured,
      updatedAt: new Date(),
    };
    if (policySupported) {
      updateData.editingPolicy = nextEditingPolicy;
    }

    const updatedPost = await prisma.post.update({
      where: { id: existingPost.id },
      data: updateData,
      select: {
        id: true,
        siteId: true,
        title: true,
        slug: true,
        shortDesc: true,
        content: true,
        metaTitle: true,
        metaDesc: true,
        ogTitle: true,
        ogDesc: true,
        ogImage: true,
        canonical: true,
        mainImage: true,
        images: true,
        categoryId: true,
        authorId: true,
        published: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
        ...(policySupported ? { editingPolicy: true } : {}),
      },
    });

    return NextResponse.json(updatedPost);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!can(session.user?.role, "canDeletePost")) {
      return NextResponse.json({ error: "Forbidden: role cannot delete posts" }, { status: 403 });
    }

    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const siteId = getSiteIdForSession(session, searchParams.get("siteId"));
    if (!siteId) return NextResponse.json({ error: "siteId required" }, { status: 400 });

    const post = await prisma.post.findFirst({
      where: { slug, siteId },
      select: { id: true, mainImage: true, ogImage: true },
    });

    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    await Promise.all([deleteLocalImage(post.mainImage), deleteLocalImage(post.ogImage)]);

    await prisma.post.delete({ where: { id: post.id } });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
