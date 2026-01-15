import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    const links = await prisma.socialLink.findMany({ orderBy: { id: 'asc' } });
    return new Response(JSON.stringify({ links }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to fetch social links' }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { platform, url } = body;

    if (!platform || !url) {
      return new Response(JSON.stringify({ error: 'Platform and URL are required' }), { status: 400 });
    }

    const link = await prisma.socialLink.create({ data: { platform, url } });
    return new Response(JSON.stringify(link), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to create social link' }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, url } = body;

    if (!id || !url) {
      return new Response(JSON.stringify({ error: 'ID and URL are required' }), { status: 400 });
    }

    const link = await prisma.socialLink.update({
      where: { id },
      data: { url },
    });

    return new Response(JSON.stringify(link), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to update social link' }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return new Response(JSON.stringify({ error: 'ID is required' }), { status: 400 });

    await prisma.socialLink.delete({ where: { id: Number(id) } });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to delete social link' }), { status: 500 });
  }
}
