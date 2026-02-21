import prisma from "@/lib/prisma";
import { DEFAULT_SITE_ID } from "@/lib/site";

const siteSettingDelegate = prisma?.siteSetting;

export async function GET() {
  try {
    if (!siteSettingDelegate) {
      return new Response("# ads.txt unavailable: prisma client is not updated yet\n", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const settings = await siteSettingDelegate.findUnique({
      where: { siteId: DEFAULT_SITE_ID },
      select: { adsTxtContent: true },
    });

    const body =
      settings?.adsTxtContent?.trim() ||
      "# ads.txt is not configured yet\n# Configure it from Admin > Settings\n";

    return new Response(body.endsWith("\n") ? body : `${body}\n`, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    console.error("ads.txt route error:", error);
    return new Response("# ads.txt unavailable\n", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
