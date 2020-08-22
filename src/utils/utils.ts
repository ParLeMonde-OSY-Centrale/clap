import fs from "fs";

/**
 * Pause the program for x milliseconds.
 * @param ms
 */
export function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export function isPasswordValid(password: string): boolean {
  return password !== undefined && password !== null && password.length >= 8 && /\d+/.test(password) && /[a-z]+/.test(password) && /[A-Z]+/.test(password);
}

export function generateTemporaryPassword(length: number): string {
  const pwdChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  return Array(length)
    .fill(pwdChars)
    .map(function (x) {
      return x[Math.floor(Math.random() * x.length)];
    })
    .join("");
}

export function getBase64File(path: string): string {
  return fs.readFileSync(path).toString("base64");
}
