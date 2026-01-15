import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" }
    });
    return new Response(JSON.stringify({ subscribers }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Newsletter GET error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch subscribers" }), { status: 500 });
  }
}
