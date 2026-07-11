export const WA_PHONE = '6281214857082';
export const WA_BASE_URL = `https://api.whatsapp.com/send/?phone=${WA_PHONE}&text=&type=phone_number&app_absent=0`;

export const buildWaLink = (text: string) =>
  `${WA_BASE_URL}&text=${encodeURIComponent(text)}`;
