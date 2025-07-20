import nodemailer from "nodemailer";
import dotenv from "dotenv";
import prisma from "../prisma/prisma";
dotenv.config();

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  hist_id: number
) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Biblioteca" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });

  await prisma.$transaction(async (tx) => {
    const hist_exists = await tx.biblioStatusHist.findFirst({
      where: {
        id: Number(hist_id),
      },
    });

    console.log(hist_id);

    if (!hist_exists) throw new Error("Registro não encontrado");

    await tx.biblioStatusHist.update({
      where: {
        id: hist_id,
      },
      data: {
        emails_sent: hist_exists.emails_sent + 1,
      },
    });
  });
}
