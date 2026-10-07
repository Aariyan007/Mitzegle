import 'dotenv/config';
import http from 'node:http';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { authRouter } from './routes/auth.js';
import { zegoRouter } from './routes/zego.js';
import { attachSocket } from './socket.js';

const origin = process.env.FRONTEND_ORIGIN;
if (!origin || !process.env.JWT_SECRET || !process.env.MONGO_URI) {
  throw new Error('Set FRONTEND_ORIGIN, JWT_SECRET and MONGO_URI in .env');
}

const app = express();
if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY));
app.use(helmet());
app.use(cors({ origin }));
app.use(express.json({ limit: '2kb' }));
app.use('/auth', authRouter);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin }, maxHttpBufferSize: 1e3 });
const { isPairedIn } = attachSocket(io);
app.use(zegoRouter(isPairedIn));

await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10_000 });
console.log("Mongo connected");
const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`Server on ${port}`));
