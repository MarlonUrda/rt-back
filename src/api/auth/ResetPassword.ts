import { Request, Response } from "express";
import User from "../../database/models/user";
import { createCode } from "../../helpers/sendEmail";
import { Resend } from "resend";
import { configDotenv } from "dotenv";
import { emailTemplate } from "../../helpers/emailTemplate";

configDotenv()

const key = process.env.RESEND_KEY
const r = new Resend(key)

export const SendResetEmail = async (req: Request, res: Response) => {
  const { email } = req.body
  console.log(email)
  
  if (!email) {
    res.status(400).json({ error: "Email required." });
    return;
  }

  const user = await User.findOne({ email: email })

  if (!user) {
    res.status(404).json({ error: "Invalid email." });
    return;
  }

  const code = createCode()

  try {
    const { data, error } = await r.emails.send({
      from: "no-reply@notebit.cervant.chat",
      to: email,
      subject: "Testing",
      html: emailTemplate(user.firstName, code)
    })

    if (error) {
      console.error(error)
      res.status(500).json({ error: "Error sending email." });
      return;
    }

    if (data) {
      res.status(200).json({message: "Email sent."})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error })
  }
}

