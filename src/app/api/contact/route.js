import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all contact messages (Admin)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    const whereClause = status !== 'all' ? { status } : {};

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.contactMessage.count({ where: whereClause })
    ]);

    return NextResponse.json({
      messages,
      pagination: {
        current: page,
        totalPages: Math.ceil(total / limit),
        limit,
        totalItems: total
      }
    });
    
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact messages' },
      { status: 500 }
    );
  }
}

// POST (User Contact Form)
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Trim
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    const validationErrors = {};

    // ---------------------------
    // NAME VALIDATION
    
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      validationErrors.name = 'Name must be between 2 and 100 characters.';
    }

    // ---------------------------
    // EMAIL VALIDATION
    // -----------------------------

    // Strong regex — only 2–6 letter TLD allowed
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[A-Za-z]{2,6}$/;

    if (!emailRegex.test(trimmedEmail)) {
      validationErrors.email = 'Please provide a valid email (example: user@example.com).';
    } else {
      const domainPart = trimmedEmail.split('@')[1];
      const domainParts = domainPart.split('.');
      const tld = domainParts[domainParts.length - 1];

      // No double dots
      if (domainPart.includes('..')) {
        validationErrors.email = 'Invalid email domain.';
      }

      // TLD letters only
      if (!/^[A-Za-z]{2,6}$/.test(tld)) {
        validationErrors.email = 'Invalid domain extension.';
      }

      // Block Gmail typos
      if (domainPart.includes('gmail') && domainPart !== 'gmail.com') {
        validationErrors.email = 'Invalid Gmail address. Check spelling.';
      }
    }

    // ---------------------------
    // BLOCK DISPOSABLE EMAILS
    // ---------------------------
    const disposableDomains = [
      'tempmail.com','mailinator.com','guerrillamail.com','10minutemail.com',
      'yopmail.com','throwawaymail.com','fakeinbox.com','temp-mail.org',
      'sharklasers.com','getairmail.com','maildrop.cc','tempinbox.com',
      'dispostable.com','mailnesia.com','trashmail.com','temp-mail.io',
      'mailcatch.com','disposablemail.com','spambox.us','tempail.com'
    ];

    const emailDomain = trimmedEmail.split('@')[1];
    if (disposableDomains.includes(emailDomain)) {
      validationErrors.email = 'Disposable email addresses are not allowed.';
    }

    // ---------------------------
    // SUBJECT VALIDATION
    // ---------------------------
    if (trimmedSubject.length < 5 || trimmedSubject.length > 200) {
      validationErrors.subject = 'Subject must be 5–200 characters long.';
    }

    // ---------------------------
    // MESSAGE VALIDATION
    // ---------------------------
    if (trimmedMessage.length < 10 || trimmedMessage.length > 5000) {
      validationErrors.message = 'Message must be 10–5000 characters long.';
    }

    // Return validation errors (if any)
    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    // ---------------------------
    // SAVE TO DATABASE
    // ---------------------------
    const saved = await prisma.contactMessage.create({
      data: {
        name: trimmedName,
        email: trimmedEmail,
        subject: trimmedSubject,
        message: trimmedMessage,
        status: 'unread'
      }
    });

    return NextResponse.json(
      { message: 'Message submitted successfully!', saved },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);

    return NextResponse.json(
      { error: 'Failed to submit the contact message' },
      { status: 500 }
    );
  }
}
