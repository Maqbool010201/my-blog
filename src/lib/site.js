export const DEFAULT_SITE_ID = process.env.NEXT_PUBLIC_DEFAULT_SITE_ID || "myblogv3";

export function resolveSiteId(sessionSiteId = null, requestedSiteId = null) {
  return DEFAULT_SITE_ID;
}
