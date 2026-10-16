import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    type: String,
    required: true,
    default: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=120&h=120&fit=crop'
  },
  url: {
    type: String,
    required: true,
    default: '#'
  },
  description: {
    type: String,
    default: 'News channel source'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Channel || mongoose.model('Channel', channelSchema);
