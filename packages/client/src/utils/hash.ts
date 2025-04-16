import CryptoJS from "crypto-js";

export function hashData(data: string): string {
  return CryptoJS.SHA256(data).toString();
}