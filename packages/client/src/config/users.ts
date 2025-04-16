import { hashData } from "../utils/hash";

export interface User {
  email: string;
  passwordHash: string;
}

export const users: User[] = [
  {
    email: "deneme@abc.com",
    passwordHash: hashData("giris123"),
  },
  {
    email: "deneme@123.com",
    passwordHash: hashData("giris456"),
  },
];