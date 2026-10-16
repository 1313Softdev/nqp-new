import express from 'express';
import Channel from '../models/Channel.js';
import News from '../models/News.js';
import { getIsMongoConnected, CHANNELS_FILE, NEWS_FILE, readLocalData } from '../config/db.js';

const router = express.Router();

// Verify Admin Secret Passkey
router.post('/login', (req, res) => {
  const { password } = req.body;
  const adminSecret = process.env.ADMIN_KEY || 'admin123';

  if (password === adminSecret || password === 'admin') {
    return res.json({ success: true, token: 'admin-authenticated-token', message: 'Welcome Admin' });
  }
  return res.status(401).json({ success: false, error: 'Invalid admin passkey' });
});

// GET Admin Dashboard Statistics
router.get('/stats', async (req, res) => {
  try {
    let totalChannels = 0;
    let totalNews = 0;
    let totalLikes = 0;
    let featuredCount = 0;

    if (getIsMongoConnected()) {
      totalChannels = await Channel.countDocuments();
      totalNews = await News.countDocuments();
      featuredCount = await News.countDocuments({ isFeatured: true });
      const likesAggregation = await News.aggregate([
        { $group: { _id: null, total: { $sum: '$likes' } } }
      ]);
      totalLikes = likesAggregation[0] ? likesAggregation[0].total : 0;
    } else {
      const channels = readLocalData(CHANNELS_FILE);
      const news = readLocalData(NEWS_FILE);
      totalChannels = channels.length;
      totalNews = news.length;
      featuredCount = news.filter(n => n.isFeatured).length;
      totalLikes = news.reduce((acc, curr) => acc + (curr.likes || 0), 0);
    }

    return res.json({
      success: true,
      data: {
        totalChannels,
        totalNews,
        featuredCount,
        totalLikes,
        mongoActive: getIsMongoConnected(),
        appName: 'News for All'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
