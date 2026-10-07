export const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const KEY = "mitzegle_token";

export const getToken = () => {
  try { return localStorage.getItem(KEY); } catch { return null; }
};
export const setToken = (t: string | null) => {
  try { t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY); } catch {}
};

async function post(path: string, body: unknown) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Something went wrong");
  return data;
}

export const requestOtp = (email: string) => post("/auth/request-otp", { email });
export const verifyOtp = async (email: string, code: string): Promise<string> =>
  (await post("/auth/verify-otp", { email, code })).token;

export async function fetchZegoToken(roomId: string): Promise<{ token: string; appId: number }> {
  const res = await fetch(`${API_URL}/zego-token?roomId=${encodeURIComponent(roomId)}`, {
    headers: { authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Cannot join room");
  return res.json();
}
