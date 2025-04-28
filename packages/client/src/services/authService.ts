export interface Session {
    token: string;
    user: { email: string };
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
      throw new Error(err.error || "Login failed");
    }
    const data: Session = await res.json();
    localStorage.setItem("app-session", JSON.stringify(data));
    return data;
  }
  
  export function getSession(): Session | null {
    const raw = localStorage.getItem("app-session");
    return raw ? JSON.parse(raw) : null;
  }
  
  export function logout() {
    localStorage.removeItem("app-session");
  }