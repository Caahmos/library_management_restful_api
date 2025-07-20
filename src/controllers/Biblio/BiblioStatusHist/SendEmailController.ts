import { Request, Response } from "express";
import { sendEmail } from "../../../utils/SendEmail";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NotifyLoanRequestBody {
  first_name: string;
  email: string;
  barcode_nmbr: string;
  status_begin_dt: string;
  due_back_dt: string;
  daysLate: number;
  title: string;
  bib_barcode: string;
}

class SendEmailController {
  static async handle(
    req: Request<{}, {}, NotifyLoanRequestBody>,
    res: Response
  ) {
    const { first_name, email, barcode_nmbr, status_begin_dt, due_back_dt, daysLate, title, bib_barcode } =
      req.body;

    if (
      !first_name ||
      !title ||
      !bib_barcode ||
      !email ||
      !barcode_nmbr ||
      !status_begin_dt ||
      !due_back_dt ||
      daysLate === undefined
    ) {
      return res.status(400).json({ message: "Dados incompletos" });
    }

    const formattedstatus_begin_dt = format(
      new Date(status_begin_dt),
      "dd 'de' MMMM 'de' yyyy",
      { locale: ptBR }
    );
    const formatteddue_back_dt = format(
      new Date(due_back_dt),
      "dd 'de' MMMM 'de' yyyy",
      { locale: ptBR }
    );

    const subject = "🔔 Aviso de Empréstimo em Atraso";

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; border-radius: 8px;">
      <h2 style="color: #d32f2f;">Olá, ${first_name} - RM ${barcode_nmbr}!</h2>
      <p>Identificamos que há um empréstimo em atraso em seu nome.</p>
      <p><strong>📚 Título:</strong> ${title}</p>
      <p><strong>📚 Código de barras:</strong> ${bib_barcode}</p>
      <p><strong>📆 Data do empréstimo:</strong> ${formattedstatus_begin_dt}</p>
      <p><strong>📅 Data de vencimento:</strong> ${formatteddue_back_dt}</p>
      <p><strong>🕒 Dias em atraso:</strong> ${daysLate} dia(s)</p>
      <p style="margin-top: 20px;">Por favor, compareça à biblioteca o quanto antes para regularizar a situação.</p>
      <br />
      <p style="color: #888; font-size: 14px;">Atenciosamente,<br/>Equipe da Biblioteca</p>
    </div>
  `;

    try {
      await sendEmail(email, subject, html);
      return res.status(200).json({ message: "E-mail enviado com sucesso!" });
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      return res.status(500).json({ message: "Erro ao enviar o e-mail." });
    }
  }
}

export default SendEmailController;
