import slugify from "slugify";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { DEFAULT_SITE_ID, resolveSiteId } from "@/lib/site";
import { ADMIN_ROLES, can, POST_EDITING_POLICIES } from "@/lib/adminPermissions";

function getSiteIdForSession(session, requestedSiteId = null) {
  return resolveSiteId(session?.user?.siteId, requestedSiteId);
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

/* ----------------------------- GET POSTS ----------------------------- */
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);

    const adminMode = searchParams.get("admin") === "true";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    let where = { published: true };

    if (adminMode && session) {
      const requestedSiteId = searchParams.get("siteId");
      const siteId = getSiteIdForSession(session, requestedSiteId);
      where = { siteId };

      const canPublishPost = can(session.user?.role, "canPublishPost");
      const canEditPost = can(session.user?.role, "canEditPost");

      if (!canPublishPost && canEditPost) {
        const policySupported = await supportsEditingPolicyField();
        where = policySupported
          ? {
              siteId,
              OR: [
                { authorId: session.user.id },
                {
                  editingPolicy: POST_EDITING_POLICIES.SUPER_ADMIN_CONTENT_ONLY,
                  author: { role: ADMIN_ROLES.SUPER_ADMIN },
                },
              ],
            }
          : {
              siteId,
              authorId: session.user.id,
            };
      }
    } else if (searchParams.get("siteId")) {
      where = { siteId: searchParams.get("siteId"), published: true };
    } else {
      where = { siteId: DEFAULT_SITE_ID, published: true };
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          siteId: true,
          title: true,
          slug: true,
          shortDesc: true,
          mainImage: true,
          categoryId: true,
          authorId: true,
          published: true,
          featured: true,
          createdAt: true,
          updatedAt: true,
          category: { select: { id: true, name: true, slug: true } },
          author: { select: { id: true, name: true } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return Response.json({ posts, total, totalPages: Math.ceil(total / limit), page });
  } catch {
    return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

/* ----------------------------- CREATE POST ----------------------------- */
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (!can(session.user?.role, "canCreatePost")) {
      return Response.json({ error: "Forbidden: role cannot create posts" }, { status: 403 });
    }

    const siteId = getSiteIdForSession(session);
    if (!siteId) return Response.json({ error: "siteId required" }, { status: 400 });

    const data = await req.json();
    if (!data.title?.trim()) return Response.json({ error: "Title required" }, { status: 400 });

    const slug = data.slug?.trim() || slugify(data.title, { lower: true, strict: true });

    const exists = await prisma.post.findFirst({
      where: { slug, siteId },
      select: { id: true },
    });
    if (exists) return Response.json({ error: "Slug already exists on your site" }, { status: 400 });

    const post = await prisma.post.create({
      data: {
        title: data.title.trim(),
        slug,
        siteId,
        authorId: session.user.id,
        shortDesc: data.shortDesc || null,
        content: data.content || "",
        metaTitle: data.metaTitle || data.title,
        metaDesc: data.metaDesc || data.shortDesc || null,
        published: can(session.user?.role, "canPublishPost") ? Boolean(data.published) : false,
        featured: can(session.user?.role, "canPublishPost") ? Boolean(data.featured) : false,
        categoryId: Number(data.categoryId),
        mainImage: data.mainImage || null,
      },
      select: {
        id: true,
        siteId: true,
        title: true,
        slug: true,
        shortDesc: true,
        content: true,
        metaTitle: true,
        metaDesc: true,
        mainImage: true,
        categoryId: true,
        authorId: true,
        published: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return Response.json({ message: "Post created", post }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create post" }, { status: 500 });
  }
}
