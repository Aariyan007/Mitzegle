# Mitzegle

Random video chat for MGITS students only. Log in with your college email, get paired with another verified student, skip or leave any time. You stay anonymous: the other person never sees your email, branch, year or roll number.

## How it works

1. Enter your email, e.g. `23cs293@mgits.ac.in`. The format is `YYbbNNN@mgits.ac.in`: join year, branch, roll number. Other domains are rejected.
2. A 6-digit code is emailed to you (valid 5 minutes, 5 tries). After verifying you get a session token valid for 7 days.
3. Press Get Started. The server pairs you with the next waiting student and the video call opens (Zego).
4. Skip finds a new partner. Leave goes back to the home screen. If your partner leaves, you go back to waiting.

## Stack

- Front end: Next.js 16, React 19, Tailwind 4, motion, socket.io-client, Zego UIKit Prebuilt
- Back end: Node (ESM), Express 5, socket.io, MongoDB (Mongoose), Nodemailer, JWT

```
BackEnd/    API, sockets, auth, matching logic
mitzegle/   Next.js app
docs/       design spec and implementation plan
```

## Run locally

Needs Node 20+, a MongoDB Atlas cluster, a Zego project, and a Gmail app password.

```bash
# back end
cd BackEnd
cp .env.example .env      # fill in the values below
npm install
npm run dev               # http://localhost:8001

# front end (second terminal)
cd mitzegle
echo 'NEXT_PUBLIC_API_URL=http://localhost:8001' > .env.local
npm install
npm run dev               # http://localhost:3000
```

### `BackEnd/.env`

| Variable | Purpose |
| --- | --- |
| `PORT` | API port (8001) |
| `FRONTEND_ORIGIN` | Exact front-end URL allowed by CORS, e.g. `http://localhost:3000` |
| `MONGO_URI` | Atlas connection string, include the db name (`/mitzegle`) |
| `JWT_SECRET` | 32+ random bytes: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `SMTP_USER`, `SMTP_PASS` | Gmail address and an app password (Google account, 2-step verification, App passwords) |
| `ZEGO_APP_ID`, `ZEGO_SERVER_SECRET` | From the Zego console. Server only, never put these in `NEXT_PUBLIC_*` |
| `TRUST_PROXY` | Set to `1` only when deployed behind one reverse proxy |
| `DEV_LOG_OTP` | Set to `1` to print codes in the server console instead of emailing. Never in production |

## Tests

```bash
cd BackEnd && npm test
```

Covers the email parser, matching queue, rate limiter, OTP helpers and Zego token signing.

## Security notes

- Only `@mgits.ac.in` addresses in the expected format can request a code. The response is the same for valid and invalid emails, so addresses can't be probed.
- Codes are random, stored hashed, expire in 5 minutes and die after 5 wrong tries. Requests are rate limited per email and per IP.
- Video tokens are issued by the server and only for the room you were paired into.
- One live connection per account. Set `banned: true` on a user in MongoDB to block them.
- CORS is locked to `FRONTEND_ORIGIN`; helmet and body size limits are on.
- Video is WebRTC, so a partner's IP may be visible depending on Zego's relay. Check `chrome://webrtc-internals` if this matters to you.
- The matching queue lives in memory: one server process, and a restart drops active calls. Scaling to several instances needs Redis.

## License

See `LICENSE`.
