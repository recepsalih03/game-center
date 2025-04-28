export interface User {
  email: string;
  passwordHash: string;
}

export const users: User[] = [
  {
    email: "employee@example.com",
    passwordHash:
      "5e884898da28047151d0e56f8dc6292773603d0d6aabbddf4e2a5f1a15a3e7d",
  },
];