import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { to, subject, text, inReplyTo, references } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "mail.de2.hostedoffice.ag",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
      headers: {
        "In-Reply-To": inReplyTo || "",
        "References": references || "",
      },
    });

    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
