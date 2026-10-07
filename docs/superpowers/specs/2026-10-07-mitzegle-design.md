# Mitzegle Design

Omegle-style random video chat for MGITS students only.

## Goal
A verified MGITS user clicks Start, is paired with another verified user, can Skip or Leave. Outsiders cannot enter. Users stay anonymous to each other.

## Stack
Next.js 16 (existing) + Node/Express + socket.io + MongoDB Atlas + Zego video + Nodemailer (Gmail app password).

## Identity
- Email format: `YYbbNNN@mgits.ac.in`, e.g. `23cs293` = join year 2023, branch `cs`, roll `293`.
- Regex: `^(\d{2})([a-z]{2,3})(\d{3})@mgits\.ac\.in$` (input lowercased, trimmed, must be a string).
- Stored: `email` (unique), `joinYear`, `branch`, `roll`, `banned` (default false), `createdAt`.
- Never sent to other users or exposed by any endpoint.

## Backend (BackEnd/)
- `models/User.js`, `models/Otp.js` (email, bcrypt codeHash, attempts, TTL index 5 min).
- `routes/auth.js`
  - `POST /auth/request-otp`: validate, rate limit (1/60s per email, 10/h per IP), send mail. Identical response for valid and invalid emails; mail only sent for valid ones.
  - `POST /auth/verify-otp`: max 5 attempts, then OTP invalidated. On success upsert User (reject if banned), return JWT (7d).
- `routes/zego.js`: `GET /zego-token?roomId=` requires JWT; issues Zego token (1h) only if server `activePairs` shows the caller is paired in that room.
- `socket.js`
  - Middleware verifies JWT and banned flag; else reject.
  - One live socket per user; a new connection kicks the old.
  - Events: `start`, `skip`, `leave`, `disconnect`. Each removes the socket from queue/pair and emits `PartnerLeft` to the partner.
  - Guards: ignore `start` when already waiting/paired; never match with self.
  - Per-socket event rate limit; unknown events and malformed payloads ignored; small `maxHttpBufferSize`.
  - Emits only `Matched {roomId}`; no partner identity.
- `lib/parseEmail.js`, `lib/queue.js`: pure logic, unit tested.
- HTTP: `helmet`, CORS locked to `FRONTEND_ORIGIN`, JSON body limit, no logging of emails.
- `.env`: `MONGO_URI`, `JWT_SECRET` (32+ random bytes), `SMTP_USER`, `SMTP_PASS`, `ZEGO_APP_ID`, `ZEGO_SERVER_SECRET`, `FRONTEND_ORIGIN`, `PORT`.

## Frontend (mitzegle/)
- `AuthGate`: email step, OTP step, green theme; token in localStorage.
- `useSocket` hook: socket created after login with `auth: {token}`; auth failure returns to login.
- `page.tsx`: states idle / waiting / talking. Fix `room` vs `roomId` prop bug; drop stray `import { div }`.
- `VideoRoom`: fetches token from `/zego-token`; Skip and Leave buttons; on `PartnerLeft` go to waiting (after skip) or idle (after leave). Remove `NEXT_PUBLIC_SERVER_SECRET` and `generateKitTokenForTest`.

## Load
Target ~100 concurrent. Single Node process with in-memory queue is enough. Limit: restart drops live sessions; multiple instances would need Redis (out of scope).

## Security summary
Anonymity by design; OTP rate limits, attempt cap, hashed codes; room tokens gated by server pairing; locked CORS; helmet; strict input validation; least-privilege Atlas user with IP allowlist; secrets only in `.env`; rotate the previously exposed Zego secret; manual `banned` flag. Known limit: WebRTC may reveal peer IP; verify Zego relay behaviour during implementation and document result.

## Testing
Unit tests: `parseEmail`, `queue` (match, skip, leave, disconnect, double start, self-match). Manual: full OTP login with a real MGITS email, two-browser match/skip/leave.

## Out of scope
Reports, bans UI, interest matching, text chat, Redis scaling.
