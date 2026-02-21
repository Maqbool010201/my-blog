import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { revalidateTag } from "next/cache";
import { DEFAULT_SITE_ID } from "@/lib/site";
const siteSettingDelegate = prisma?.siteSetting;

const LEGACY_SAFE_KEYS = [
  "googleSiteVerification",
  "googleAdsenseClientId",
  "googleAnalyticsId",
  "adsTxtContent",
];

function normalizeOptional(value) {
  const str = String(value ?? "").trim();
  return str.length ? str : null;
}

function parsePositiveInt(value, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.round(n);
}

function resolveSiteId(session, requestedSiteId) {
  return DEFAULT_SITE_ID;
}

function buildUpdatePayload(body) {
  const payload = {};

  if ("siteName" in body) payload.siteName = normalizeOptional(body.siteName);
  if ("logoUrl" in body) payload.logoUrl = normalizeOptional(body.logoUrl);
  if ("logoAlt" in body) payload.logoAlt = normalizeOptional(body.logoAlt);
  if ("logoDisplay" in body) payload.logoDisplay = normalizeOptional(body.logoDisplay) || "IMAGE_AND_TEXT";
  if ("logoWidth" in body) payload.logoWidth = parsePositiveInt(body.logoWidth, 180);
  if ("logoHeight" in body) payload.logoHeight = parsePositiveInt(body.logoHeight, 48);
  if ("storageProvider" in body) payload.storageProvider = normalizeOptional(body.storageProvider) || "LOCAL";
  if ("imageKitPublicKey" in body) payload.imageKitPublicKey = normalizeOptional(body.imageKitPublicKey);
  if ("imageKitPrivateKey" in body) payload.imageKitPrivateKey = normalizeOptional(body.imageKitPrivateKey);
  if ("imageKitUrlEndpoint" in body) payload.imageKitUrlEndpoint = normalizeOptional(body.imageKitUrlEndpoint);
  if ("imageKitFolder" in body) payload.imageKitFolder = normalizeOptional(body.imageKitFolder);
  if ("cloudinaryCloudName" in body) payload.cloudinaryCloudName = normalizeOptional(body.cloudinaryCloudName);
  if ("cloudinaryApiKey" in body) payload.cloudinaryApiKey = normalizeOptional(body.cloudinaryApiKey);
  if ("cloudinaryApiSecret" in body) payload.cloudinaryApiSecret = normalizeOptional(body.cloudinaryApiSecret);
  if ("cloudinaryFolder" in body) payload.cloudinaryFolder = normalizeOptional(body.cloudinaryFolder);

  if ("googleSiteVerification" in body) payload.googleSiteVerification = normalizeOptional(body.googleSiteVerification);
  if ("googleAdsenseClientId" in body) payload.googleAdsenseClientId = normalizeOptional(body.googleAdsenseClientId);
  if ("googleAnalyticsId" in body) payload.googleAnalyticsId = normalizeOptional(body.googleAnalyticsId);
  if ("adsTxtContent" in body) payload.adsTxtContent = normalizeOptional(body.adsTxtContent);

  return payload;
}

function legacyOnlyPayload(payload) {
  const safe = {};
  for (const key of LEGACY_SAFE_KEYS) {
    if (key in payload) safe[key] = payload[key];
  }
  return safe;
}

async function upsertWithFallback(siteId, payload) {
  try {
    return await siteSettingDelegate.upsert({
      where: { siteId },
      create: { siteId, ...payload },
      update: payload,
    });
  } catch (error) {
    const message = String(error?.message || "");
    const isUnknownFieldError =
      message.includes("Unknown argument") || message.includes("Unknown field");

    if (!isUnknownFieldError) throw error;

    const safePayload = legacyOnlyPayload(payload);
    return await siteSettingDelegate.upsert({
      where: { siteId },
      create: { siteId, ...safePayload },
      update: safePayload,
    });
  }
}

export async function GET(request) {
  try {
    if (!siteSettingDelegate) {
      return NextResponse.json(
        { error: "Site settings model is not available yet. Run: npx prisma generate" },
        { status: 503 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const requestedSiteId = searchParams.get("siteId");
    const siteId = resolveSiteId(session, requestedSiteId);

    if (!siteId) {
      return NextResponse.json({ error: "siteId is required for this user" }, { status: 400 });
    }

    const settings = await siteSettingDelegate.findUnique({ where: { siteId } });

    return NextResponse.json({
      siteId,
      settings: {
        siteId,
        siteName: settings?.siteName || "",
        logoUrl: settings?.logoUrl || "",
        logoAlt: settings?.logoAlt || "",
        logoDisplay: settings?.logoDisplay || "IMAGE_AND_TEXT",
        logoWidth: settings?.logoWidth || 180,
        logoHeight: settings?.logoHeight || 48,
        storageProvider: settings?.storageProvider || "LOCAL",
        imageKitPublicKey: settings?.imageKitPublicKey || "",
        imageKitPrivateKey: settings?.imageKitPrivateKey || "",
        imageKitUrlEndpoint: settings?.imageKitUrlEndpoint || "",
        imageKitFolder: settings?.imageKitFolder || "",
        cloudinaryCloudName: settings?.cloudinaryCloudName || "",
        cloudinaryApiKey: settings?.cloudinaryApiKey || "",
        cloudinaryApiSecret: settings?.cloudinaryApiSecret || "",
        cloudinaryFolder: settings?.cloudinaryFolder || "",
        googleSiteVerification: settings?.googleSiteVerification || "",
        googleAdsenseClientId: settings?.googleAdsenseClientId || "",
        googleAnalyticsId: settings?.googleAnalyticsId || "",
        adsTxtContent: settings?.adsTxtContent || "",
      },
    });
  } catch (error) {
    console.error("Get site settings error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    if (!siteSettingDelegate) {
      return NextResponse.json(
        { error: "Site settings model is not available yet. Run: npx prisma generate" },
        { status: 503 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const requestedSiteId = normalizeOptional(body.siteId);
    const siteId = resolveSiteId(session, requestedSiteId);

    if (!siteId) {
      return NextResponse.json({ error: "siteId is required for this user" }, { status: 400 });
    }

    const payload = buildUpdatePayload(body);
    if (!Object.keys(payload).length) {
      return NextResponse.json({ error: "No fields provided to update" }, { status: 400 });
    }

    const updated = await upsertWithFallback(siteId, payload);
    revalidateTag(`menu-settings-${siteId}`);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Update site settings error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
