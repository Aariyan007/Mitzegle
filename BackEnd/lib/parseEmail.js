const RE = /^(\d{2})([a-z]{2,3})(\d{3})@mgits\.ac\.in$/;

export function parseEmail(input) {
  if (typeof input !== 'string') return null;
  const email = input.trim().toLowerCase();
  const m = RE.exec(email);
  if (!m) return null;
  return { email, joinYear: 2000 + Number(m[1]), branch: m[2], roll: m[3] };
}
