import { downloadFile } from "../fileUpload";

import { locales as defaultLocales } from "./defaultLocales";

export const getLocales = async (language: string): Promise<{ [key: string]: string }> => {
  // TODO: add language table and check language availability

  const JSONlanguageBuffer: Buffer | null = await downloadFile(`locales/${language}.json`);
  const locales = JSONlanguageBuffer !== null ? JSON.parse(JSONlanguageBuffer.toString()) : {};

  return {
    ...defaultLocales,
    ...locales,
  };
};
