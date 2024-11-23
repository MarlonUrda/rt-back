import { Request, Response } from "express";
import User from "../../database/models/user";
import { createCode, verifyCode } from "../../helpers/sendEmail";
import { Resend } from "resend";
import { configDotenv } from "dotenv";
import { emailTemplate } from "../../helpers/emailTemplate";
import ResetCode from "../../database/models/resetCode";
import { hashPassword } from "../../helpers/auth";

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

  const code = await createCode(email)

  try {
    const { data, error } = await r.emails.send({
      from: "no-reply@rminds.cervant.chat",
      to: email,
      subject: "Reset your password",
      html: emailTemplate(user.firstName, code),
    });

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

export const verifyResetCodes = async (req: Request, res: Response) => {
  const { code } = req.body;

  if (!code) {
    res.status(400).json({ error: "Code required." });
  }

  const isVerified = await verifyCode(code)

  if (!isVerified) {
    res.status(400).json({ error: "Invalid code." });
  }

  res.status(200).json({ message: "Code verified." });
}

export const updatePassword = async (req: Request, res: Response) => {
  const { code, password } = req.body;

  if(!code || !password) {
    res.status(400).json({ error: "Invalid request." });
    return
  }

  const userCode = await ResetCode.findOne({ code: code })

  if (!userCode) {
    res.status(404).json({ error: "Code not found." });
    return
  }

  const hashedPassword = await hashPassword(password)

  const userUpdate = await User.findOneAndUpdate({ email: userCode.email }, { password: hashedPassword }, { new: true })

  if (!userUpdate) {
    res.status(400).json({ error: "Error changing passwords" })
  }

  res.status(200).json({ message: "Password changed." })
}