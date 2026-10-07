import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  codeHash: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now, expires: 300 },
});

export default mongoose.model('Otp', schema);
