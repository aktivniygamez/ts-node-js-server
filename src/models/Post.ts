import { maxLength, minLength } from 'class-validator';
import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: [5, 'Title should be more than 5 symbols'],
      maxLength: [30, 'Title should be less than 30 symbols']
    },
    text: {
      type: String,
      required: true,
      unique: true,
      minLength: [5, 'Text should be more than 5 symbols'],
      maxLength: [30, 'Text should be less than 30 symbols']
    },
    tags: {
      type: Array,
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    imageUrl: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Post', PostSchema);
