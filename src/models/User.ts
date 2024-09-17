import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: [5, 'Title must be at least 5 characters long'], // Минимум 5 символов
      maxlength: [30, 'Title must be at most 30 characters long'],
    },
    passwordHash: {
      type: String,
      required: true,
      minlength: [5, 'Title must be at least 5 characters long'], // Минимум 5 символов
      maxlength: [60, 'Title must be at most 30 characters long'],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('User', UserSchema);
