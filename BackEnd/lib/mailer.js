import nodemailer from 'nodemailer';

let transporter;

export async function sendOtp(to, code) {
  transporter ??= nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transporter.sendMail({
    from: `Mitzegle <${process.env.SMTP_USER}>`,
    to,
    subject: 'Your Mitzegle code',
    text: `Your code is ${code}. It expires in 5 minutes.`,
  });
}
