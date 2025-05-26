import { createHash } from "crypto";

export function hashData(plain: string): string {
  return createHash("sha256").update(plain).digest("hex");
}