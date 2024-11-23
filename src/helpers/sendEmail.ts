export const createCode = (): string => {
  const randomNumber = Math.floor(Math.random() * 1000000)
  const code = randomNumber.toString().padStart(6, "0")

  console.log(code)

  return code
}