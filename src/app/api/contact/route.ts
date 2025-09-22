import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ContactFormData = {
  name: string;
  email: string;
  company?: string;
  message: string;
};

function badReq(msg: string) {
  return NextResponse.json({ error: msg }, { status: 400 });
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const body = (await req.json()) as ContactFormData;
    const { name, email, company, message } = body || ({} as ContactFormData);

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return badReq('Name, email, and message are required');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return badReq('Invalid email');

    const toEmail = process.env.EMAIL_TO || 'kirillginko@gmail.com';

    if (process.env.EMAIL_DEV_MODE === 'true') {
      const msg = {
        to: toEmail,
        from: email,
        subject: `New Contact Form Submission from ${name}`,
        replyTo: email,
        text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || 'Not provided'}\nMessage:\n${message}`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin:0 auto;">
          <h2 style="color:#333;border-bottom:2px solid #ff5057;padding-bottom:10px;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Company:</strong> ${escapeHtml(company || 'Not provided')}</p>
          <p><strong>Message:</strong></p>
          <div style="background:#f8f9fa;padding:15px;border-left:4px solid #ff5057;margin-top:10px;">
            ${escapeHtml(message).replace(/\n/g, '<br>')}
          </div>
          <hr style="border:none;border-top:1px solid #eee;margin:30px 0;">
          <p style="color:#666;font-size:14px;">Sent from your contact form.</p>
        </div>`
      };
      console.log('DEV MODE - Would send email:', JSON.stringify(msg, null, 2));
      return NextResponse.json({ message: 'Email logged (dev mode)' });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });

    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: `New Contact Form Submission from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || 'Not provided'}\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin:0 auto;">
          <h2 style="color:#333;border-bottom:2px solid #ff5057;padding-bottom:10px;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Company:</strong> ${escapeHtml(company || 'Not provided')}</p>
          <p><strong>Message:</strong></p>
          <div style="background:#f8f9fa;padding:15px;border-left:4px solid #ff5057;margin-top:10px;">
            ${escapeHtml(message).replace(/\n/g, '<br>')}
          </div>
          <hr style="border:none;border-top:1px solid #eee;margin:30px 0;">
          <p style="color:#666;font-size:14px;">Sent from your contact form.</p>
        </div>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Email error:', err);
    return NextResponse.json({ error: 'Failed to send email', detail: msg }, { status: 500 });
  }
}

function escapeHtml(input: string) {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
