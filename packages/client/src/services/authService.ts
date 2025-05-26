export interface Session {
  user: { email: string };
  accessToken: string;
  refreshToken: string;
}

export async function login(
  email: string,
  password: string
): Promise<Session> {
  const res = await fetch("http://localhost:4000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Giriş başarısız");
  }
  const data: Session = await res.json();
  localStorage.setItem("app-session", JSON.stringify(data));
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  return data;
}

export function getSession(): Session | null {
  const raw = localStorage.getItem("app-session");
  return raw ? JSON.parse(raw) : null;
}

export function logout(): void {
  localStorage.removeItem("app-session");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}