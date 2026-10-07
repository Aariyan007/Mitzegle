"use client";
import { useState } from "react";
import { requestOtp, verifyOtp } from "../lib/api";

const EMAIL_RE = /^\d{2}[a-z]{2,3}\d{3}@mgits\.ac\.in$/;

export default function AuthGate({ onAuthed }: { onAuthed: (token: string) => void }) {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const normalized = email.trim().toLowerCase();

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(normalized)) return setError("Use your MGITS email, e.g. 23cs293@mgits.ac.in");
    setBusy(true); setError("");
    try { await requestOtp(normalized); setStep("code"); }
    catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }

  async function submitCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    try { onAuthed(await verifyOtp(normalized, code.trim())); }
    catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }

  const input = "w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-green-200/50 outline-none focus:border-green-300";
  const btn = "w-full px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-semibold disabled:opacity-50";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-green-800 to-green-950 text-white px-6">
      <form onSubmit={step === "email" ? sendCode : submitCode}
        className="w-full max-w-sm space-y-4 bg-black/20 backdrop-blur-md p-8 rounded-2xl border border-white/10">
        <h2 className="text-2xl font-bold">Verify you are from MGITS</h2>
        {step === "email" ? (
          <input className={input} type="email" placeholder="23cs293@mgits.ac.in"
            value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
        ) : (
          <>
            <p className="text-sm text-green-100/80">Code sent to {normalized}</p>
            <input className={input} inputMode="numeric" maxLength={6} placeholder="6-digit code"
              value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} autoFocus />
          </>
        )}
        {error && <p className="text-sm text-red-300">{error}</p>}
        <button className={btn} disabled={busy}>{busy ? "Please wait..." : step === "email" ? "Send code" : "Verify"}</button>
        {step === "code" && (
          <button type="button" className="text-sm underline text-green-200/80"
            onClick={() => { setStep("email"); setCode(""); setError(""); }}>Change email</button>
        )}
      </form>
    </div>
  );
}
