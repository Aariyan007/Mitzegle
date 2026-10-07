import { randomInt } from 'node:crypto';
import bcrypt from 'bcryptjs';

export const generateCode = () => String(randomInt(0, 1_000_000)).padStart(6, '0');
export const hashCode = (code) => bcrypt.hash(code, 10);
export const checkCode = (code, hash) => bcrypt.compare(code, hash);
