import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "" },
});

export const UserModel = mongoose.model('User', userSchema);