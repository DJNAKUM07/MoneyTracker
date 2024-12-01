import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  friendId: {
    type: String,
    required: true,
    ref: 'Friend'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['GAVE', 'RECEIVED'],
    required: true
  },
  date: {
    type: Date,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
});

transactionSchema.index({ date: -1 });

export default mongoose.model('Transaction', transactionSchema);