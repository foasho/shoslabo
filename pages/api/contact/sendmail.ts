import type { NextApiRequest, NextApiResponse } from 'next';
import { createTransport } from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const { name, company, email, message } = req.body;
  const transposer = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_ADDRESS,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  // 送信者にメールを送信
  const mailData = {
    from: process.env.MAIL_ADDRESS,
    to: email,
    subject: `メッセージ送信を受理しました： ${name} 様`,
    text: message,
    html: ` ${name} 様<br/><br/><p>以下の内容で送信しました。</p><div>${message}</div>`,
  };
  // 管理人にメールを送信
  const mailData2 = {
    from: process.env.MAIL_ADDRESS,
    to: process.env.MAIL_RECIEVER,
    subject: `メッセージ送信を受信しました： ${name} 様より 法人(${company})`,
    text: message,
    html: `<div>${message}</div> <br/> <div>${name}様 法人名：${company}</div> <div>メールアドレス：${email}</div> `,
  };
  try {
    await transposer.sendMail(mailData);
    await transposer.sendMail(mailData2);
    res.status(200).json({ status: "OK" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}