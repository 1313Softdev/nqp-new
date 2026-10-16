import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  postType: {
    type: String,
    enum: ['News', 'Story', 'Article', 'Editorial', 'Video'],
    default: 'Article'
  },
  author: {
    type: String,
    default: 'Editorial Desk'
  },
  readTime: {
    type: String,
    default: '5 min read'
  },
  publishDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  publishedAt: {
    type: String,
    default: 'Oct 17, 2026'
  },
  url: {
    type: String,
    default: ''
  },
  youtubeUrl: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900&auto=format&fit=crop&q=80'
  },
  category: {
    type: String,
    required: true,
    default: 'News'
  },
  tags: {
    type: [String],
    default: []
  },
  channelName: {
    type: String,
    default: 'News for All'
  },
  channelLogo: {
    type: String,
    default: ''
  },
  seoTitle: {
    type: String,
    default: ''
  },
  seoDescription: {
    type: String,
    default: ''
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  postedByAdmin: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.News || mongoose.model('News', newsSchema);
