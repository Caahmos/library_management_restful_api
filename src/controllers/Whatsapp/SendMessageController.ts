import { Request, Response } from "express";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getClient } from "../../whatsappClient";
import { getWhatsappStatus } from "../../whatsappClient";

interface NotifyLoanRequestBody {
  first_name: string;
  last_name: string;
  barcode_nmbr: string;
  status_begin_dt: string;
  due_back_dt: string;
  daysLate: number;
  title: string;
  bib_barcode: string;
  hist_id: number;
}

class SendMessageController {
  static async handle(
    req: Request<{ phonenumber: string }, {}, NotifyLoanRequestBody>,
    res: Response
  ) {
    const phone = req.params.phonenumber;

    const {
      first_name,
      last_name,
      barcode_nmbr,
      status_begin_dt,
      due_back_dt,
      daysLate,
      title,
      bib_barcode,
      hist_id,
    } = req.body;

    const userId = req.userid;
    const userroles = req.userroles;
    const { status } = getWhatsappStatus();

    if(status !== "inChat") return res.status(522).json({ type: "error", message: "Conecte-se primeiro no painel de Admin"})

    if (!userId)
      return res.status(422).json({
        type: "error",
        message: "Usuário não autenticado!",
      });

    if (!userroles.circ_mbr_flg)
      return res.status(422).json({
        type: "error",
        message: "Usuário não tem permissão!",
      });

    if (
      !first_name ||
      !last_name ||
      !title ||
      !bib_barcode ||
      !phone ||
      !barcode_nmbr ||
      !status_begin_dt ||
      !due_back_dt ||
      !hist_id ||
      daysLate === undefined
    ) {
      return res.status(400).json({ message: "Dados incompletos", type: "error" });
    }

    const formattedLoan = format(
      new Date(status_begin_dt),
      "dd 'de' MMMM 'de' yyyy",
      { locale: ptBR }
    );

    const formattedDue = format(
      new Date(due_back_dt),
      "dd 'de' MMMM 'de' yyyy",
      { locale: ptBR }
    );

    const message = `
🔔 *Aviso de Empréstimo em Atraso*

Olá, *${first_name} ${last_name}* – RM *${barcode_nmbr}*.

Identificamos que há um empréstimo em atraso em seu nome.

📚 *Título:* ${title}
📕 *Cód. de barras:* ${bib_barcode}

📆 *Data do empréstimo:* ${formattedLoan}
📅 *Vencimento:* ${formattedDue}

⏳ *Dias em atraso:* ${daysLate}

Por favor, compareça à biblioteca para regularizar sua situação.

Obrigado,
*Equipe da Biblioteca*
    `.trim();

    let client;
    try {
      client = getClient();
      console.log("CLIENTTTT === " + client)
    } catch (err) {
      console.warn("Nenhuma sessão ativa do WhatsApp encontrada.");
      console.log("CLIENTTTT === " + client)
      return res.status(400).json({
        type: "error",
        message: "Não existe sessão ativa do WhatsApp.",
      });
    }

    try {
      const jid = `${phone}@c.us`;
      await client.sendText(jid, message);

      return res.status(200).json({
        message: "Mensagem enviada via WhatsApp com sucesso!",
        type: "success",
      });

    } catch (error) {
      console.error("Erro ao enviar WhatsApp:", error);
      return res.status(500).json({
        message: "Erro ao enviar mensagem via WhatsApp.",
        type: "error",
      });
    }
  }
}

export default SendMessageController;