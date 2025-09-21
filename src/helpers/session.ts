export function setAccessToken(token: string) {
  if (typeof window === "undefined") return;
  if (typeof import.meta.env.VITE_ACCESS_TOKEN_NAME === "string") {
    localStorage.setItem(import.meta.env.VITE_ACCESS_TOKEN_NAME, token);
  }
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  if (typeof import.meta.env.VITE_ACCESS_TOKEN_NAME === "string") {
    return localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_NAME);
  }
  return null;
}

export function clearAccessToken() {
  if (typeof window === "undefined") return;
  if (typeof import.meta.env.VITE_ACCESS_TOKEN_NAME === "string") {
    localStorage.removeItem(import.meta.env.VITE_ACCESS_TOKEN_NAME);
  }
}
