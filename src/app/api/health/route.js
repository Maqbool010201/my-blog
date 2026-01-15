// src/app/api/health/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check if posts table exists and has data
    const postCount = await prisma.post.count();
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      database: 'connected',
      postCount,
      uptime: process.uptime()
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
  }
}