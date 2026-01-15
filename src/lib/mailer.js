import nodemailer from "nodemailer";

export async function sendResetEmail({ to, resetUrl }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Reset Your Password",
    html: `<p>Click the link below to reset your password:</p>
           <a href="${resetUrl}">${resetUrl}</a>`,
  });

  console.log("Reset email sent:", nodemailer.getTestMessageUrl(info));
}
