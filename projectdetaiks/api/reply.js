// api/reply.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { to, subject, message, inReplyTo } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
      headers: inReplyTo ? { 'In-Reply-To': inReplyTo } : {},
    });

    return res.status(200).json({
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
