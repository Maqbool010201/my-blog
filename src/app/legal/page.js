// src/app/legal/page.js (Add this temporarily at the top)
import prisma from '@/lib/prisma';

async function createTestPage() {
  try {
    await prisma.legalPage.create({
      data: {
        slug: 'about-wise-mix-media',
        title: 'About Wisemix Media',
        content: '<h1>About Us</h1><p>This is Wisemix Media...</p>',
        description: 'Learn about Wisemix Media',
        order: 1,
        isActive: true
      }
    });
    console.log('Test page created');
  } catch (error) {
    console.log('Page already exists or error:', error.message);
  }
}

// Call it (you can remove this after)
createTestPage();