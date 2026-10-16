import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'News for All'
  },
  siteTagline: {
    type: String,
    default: 'THE GLOBAL CHRONICLE • INDEPENDENT STORIES, NEWS & EDITORIAL ARTICLES'
  },
  siteEdition: {
    type: String,
    default: 'VOL. XCIV • INTERNATIONAL EDITION'
  },
  logoUrl: {
    type: String,
    default: ''
  },
  metaTitle: {
    type: String,
    default: 'News for All — Modern Vintage Editorial & Global News Blog'
  },
  metaDescription: {
    type: String,
    default: 'An independent modern-vintage publication dedicated to breaking news, investigative stories, cultural essays, and video journalism.'
  },
  metaKeywords: {
    type: String,
    default: 'news, blog, stories, articles, investigative journalism, video news, world, politics, culture'
  },
  ogImage: {
    type: String,
    default: ''
  },
  categories: {
    type: [String],
    default: ['All', 'News', 'Stories', 'Articles', 'World', 'Politics', 'Culture', 'Technology', 'Opinion', 'Video']
  },
  postFormats: {
    type: [String],
    default: ['News', 'Story', 'Article', 'Editorial', 'Video']
  },
  theme: {
    bgColor: { type: String, default: '#FBF8F3' },
    cardBg: { type: String, default: '#FFFDF9' },
    textColor: { type: String, default: '#181615' },
    accentColor: { type: String, default: '#9E2A2B' },
    secondaryText: { type: String, default: '#5C554E' },
    borderColor: { type: String, default: '#D8CFC2' },
    presetName: { type: String, default: 'Classic Broadsheet' }
  },
  socialLinks: {
    facebook: { type: String, default: 'https://facebook.com' },
    instagram: { type: String, default: 'https://instagram.com' },
    linkedin: { type: String, default: 'https://linkedin.com' },
    medium: { type: String, default: 'https://medium.com' },
    youtube: { type: String, default: 'https://youtube.com' },
    twitter: { type: String, default: 'https://x.com' }
  },
  footerText: {
    type: String,
    default: '© 2026 News for All Chronicle. Printed & Published Digitally Worldwide. All Rights Reserved.'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
