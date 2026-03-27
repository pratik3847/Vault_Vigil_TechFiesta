export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

export async function apiGet<T = unknown>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${path} failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`);
  }

  return (await res.json()) as T;
}
