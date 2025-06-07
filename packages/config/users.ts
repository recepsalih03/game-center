export interface User {
  username: string;
  passwordHash: string;
}

const PASSWORD_HASH = "9ff12629127f90c21ef8618826848f76bcc0469969ec87e6c06da8ef7a77a649";

export const users: User[] = [
  {
    username: "recep_salih",
    passwordHash: PASSWORD_HASH,
  },
  {
    username: "emir_han",
    passwordHash: PASSWORD_HASH,
  },
  {
    username: "yusuf_talha",
    passwordHash: PASSWORD_HASH,
  },
  {
    username: "omer_batuhan",
    passwordHash: PASSWORD_HASH,
  },
];