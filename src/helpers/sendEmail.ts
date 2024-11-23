import ResetCode from "../database/models/resetCode"

export const createCode = async (email: string): Promise<string> => {
  let code: string;
  let codeExist: boolean;

  do {
    const randomNumber = Math.floor(Math.random() * 1000000);
    code = randomNumber.toString().padStart(6, "0");

    console.log(code);

    const existingCode = await ResetCode.findOne({ code: code });
    codeExist = !!existingCode;
  } while (codeExist);

  const newCode = new ResetCode({
    code: code,
    email: email
  })

  await newCode.save();

  return code
}

export const verifyCode = async (code: string): Promise<boolean> => {
  const exist = await ResetCode.findOne({ code: code })

  if(exist) {
    return true
  }

  return false
}