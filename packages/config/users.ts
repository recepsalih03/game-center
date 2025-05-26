export interface User {
  email: string;
  passwordHash: string;
}

const PASSWORD = "password";
const REAL_HASH = "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8";

export const users: User[] = [
  {
    email: "employee@example.com",
    passwordHash: REAL_HASH,
  },
];