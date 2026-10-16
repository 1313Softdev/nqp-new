import express from 'express';
import News from '../models/News.js';
import {
  getIsMySQLConnected,
  getMySQLPool,
  getIsMongoConnected,
  NEWS_FILE,
  readLocalData,
  writeLocalData
} from '../config/db.js';
import { broadcastRealtimeEvent } from '../realtime.js';

const router = express.Router();

const normalizeNewsRow = (row) => {
  if (!row) return null;
  let parsedTags = [];
  if (Array.isArray(row.tags)) {
    parsedTags = row.tags;
  } else if (typeof row.tags === 'string' && row.tags.trim()) {
    try {
      parsedTags = JSON.parse(row.tags);
    } catch (e) {
      parsedTags = row.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
  }
  return {
    ...row,
    tags: parsedTags,
    likes: Number(row.likes || 0),
    dislikes: Number(row.dislikes || 0),
    isFeatured: Boolean(row.isFeatured),
    postedByAdmin: Boolean(row.postedByAdmin)
  };
};

// GET all posts with filtering (category, postType, channel, search, featured, twoLatestPerChannel)
router.get('/', async (req, res) => {
  try {
    const { category, postType, channel, search, featured, twoLatestPerChannel } = req.query;

    let articles = [];
    if (getIsMySQLConnected()) {
      const pool = getMySQLPool();
      const [rows] = await pool.query('SELECT * FROM news ORDER BY publishDate DESC, createdAt DESC');
      articles = rows.map(normalizeNewsRow);
    } else if (getIsMongoConnected()) {
      const docs = await News.find({}).sort({ publishDate: -1, createdAt: -1 });
      articles = docs.map(d => d.toObject ? d.toObject() : d);
    } else {
      articles = readLocalData(NEWS_FILE);
    }

    // Apply unified filtering across any active engine
    if (category && category !== 'All') {
      const catLower = category.toLowerCase();
      articles = articles.filter(a =>
        (a.category && a.category.toLowerCase() === catLower) ||
        (a.category && a.category.toLowerCase().includes(catLower)) ||
        (a.postType && a.postType.toLowerCase() === catLower) ||
        (catLower === 'stories' && a.postType && a.postType.toLowerCase() === 'story') ||
        (catLower === 'articles' && a.postType && a.postType.toLowerCase() === 'article') ||
        (catLower === 'video' && (a.youtubeUrl || (a.postType && a.postType.toLowerCase() === 'video')))
      );
    }

    if (postType && postType !== 'All') {
      articles = articles.filter(a => (a.postType || '').toLowerCase() === postType.toLowerCase());
    }

    if (channel && channel !== 'All') {
      articles = articles.filter(a => (a.channelName || '').toLowerCase() === channel.toLowerCase());
    }

    if (featured === 'true') {
      articles = articles.filter(a => Boolean(a.isFeatured) === true);
    }

    if (search) {
      const q = search.toLowerCase();
      articles = articles.filter(a =>
        (a.title || '').toLowerCase().includes(q) ||
        (a.subtitle || '').toLowerCase().includes(q) ||
        (a.description || '').toLowerCase().includes(q) ||
        (a.category || '').toLowerCase().includes(q) ||
        (a.postType || '').toLowerCase().includes(q) ||
        (a.author || '').toLowerCase().includes(q) ||
        (a.channelName || '').toLowerCase().includes(q)
      );
    }

    articles.sort(
      (a, b) =>
        new Date(b.publishDate || b.createdAt || Date.now()) -
        new Date(a.publishDate || a.createdAt || Date.now())
    );

    if (twoLatestPerChannel === 'true') {
      const channelGroups = {};
      const filteredResult = [];
      for (const article of articles) {
        const cName = article.channelName || 'News for All';
        if (!channelGroups[cName]) channelGroups[cName] = 0;
        if (channelGroups[cName] < 2) {
          channelGroups[cName]++;
          filteredResult.push(article);
        }
      }
      articles = filteredResult;
    }

    return res.json({ success: true, count: articles.length, data: articles });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create new article/story/news by Admin
router.post('/', async (req, res) => {
  try {
    const {
      title,
      subtitle,
      postType,
      author,
      readTime,
      publishDate,
      publishedAt,
      url,
      youtubeUrl,
      description,
      image,
      category,
      tags,
      channelName,
      channelLogo,
      seoTitle,
      seoDescription,
      likes,
      dislikes,
      isFeatured
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }

    const formattedDate = publishDate
      ? new Date(publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : publishedAt || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newId = 'news_' + Date.now();
    const parsedTags = Array.isArray(tags)
      ? tags
      : tags
      ? String(tags).split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const payload = {
      _id: newId,
      title,
      subtitle: subtitle || '',
      postType: postType || 'Article',
      author: author || 'Editorial Desk',
      readTime: readTime || '5 min read',
      publishDate: publishDate || new Date().toISOString().split('T')[0],
      publishedAt: formattedDate,
      url: url || '',
      youtubeUrl: youtubeUrl || '',
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900&auto=format&fit=crop&q=80',
      category: category || 'News',
      tags: parsedTags,
      channelName: channelName || 'News for All',
      channelLogo: channelLogo || '',
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || (description ? description.substring(0, 160) : ''),
      likes: parseInt(likes) || 0,
      dislikes: parseInt(dislikes) || 0,
      isFeatured: isFeatured === true || isFeatured === 'true',
      postedByAdmin: true,
      createdAt: new Date().toISOString()
    };

    if (getIsMySQLConnected()) {
      const pool = getMySQLPool();
      await pool.query(
        `INSERT INTO news (
          _id, title, subtitle, postType, author, readTime, publishDate, publishedAt,
          url, youtubeUrl, description, image, category, tags, channelName, channelLogo,
          seoTitle, seoDescription, likes, dislikes, isFeatured, postedByAdmin, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          payload._id,
          payload.title,
          payload.subtitle,
          payload.postType,
          payload.author,
          payload.readTime,
          payload.publishDate,
          payload.publishedAt,
          payload.url,
          payload.youtubeUrl,
          payload.description,
          payload.image,
          payload.category,
          JSON.stringify(payload.tags),
          payload.channelName,
          payload.channelLogo,
          payload.seoTitle,
          payload.seoDescription,
          payload.likes,
          payload.dislikes,
          payload.isFeatured ? 1 : 0,
          1,
          new Date()
        ]
      );
      // Sync local backup
      const articles = readLocalData(NEWS_FILE);
      articles.unshift(payload);
      writeLocalData(NEWS_FILE, articles);
      broadcastRealtimeEvent('news_created', payload);
      return res.status(201).json({ success: true, data: payload });
    } else if (getIsMongoConnected()) {
      const { _id, ...mongoPayload } = payload;
      const newArticle = await News.create(mongoPayload);
      broadcastRealtimeEvent('news_created', newArticle);
      return res.status(201).json({ success: true, data: newArticle });
    } else {
      const articles = readLocalData(NEWS_FILE);
      articles.unshift(payload);
      writeLocalData(NEWS_FILE, articles);
      broadcastRealtimeEvent('news_created', payload);
      return res.status(201).json({ success: true, data: payload });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT edit existing article/story/news by Admin
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.publishDate) {
      updates.publishedAt = new Date(updates.publishDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }

    if (updates.tags && !Array.isArray(updates.tags)) {
      updates.tags = String(updates.tags).split(',').map(t => t.trim()).filter(Boolean);
    }

    if (getIsMySQLConnected()) {
      const pool = getMySQLPool();
      const [rows] = await pool.query('SELECT * FROM news WHERE _id = ? LIMIT 1', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Post not found' });
      }
      const existing = normalizeNewsRow(rows[0]);
      const merged = {
        ...existing,
        ...updates,
        likes: updates.likes !== undefined ? parseInt(updates.likes) || 0 : existing.likes,
        dislikes: updates.dislikes !== undefined ? parseInt(updates.dislikes) || 0 : existing.dislikes,
        isFeatured: updates.isFeatured !== undefined ? (updates.isFeatured === true || updates.isFeatured === 'true') : existing.isFeatured
      };

      await pool.query(
        `UPDATE news SET
          title = ?, subtitle = ?, postType = ?, author = ?, readTime = ?,
          publishDate = ?, publishedAt = ?, url = ?, youtubeUrl = ?, description = ?,
          image = ?, category = ?, tags = ?, channelName = ?, channelLogo = ?,
          seoTitle = ?, seoDescription = ?, likes = ?, dislikes = ?, isFeatured = ?
        WHERE _id = ?`,
        [
          merged.title,
          merged.subtitle || '',
          merged.postType || 'Article',
          merged.author || 'Editorial Desk',
          merged.readTime || '5 min read',
          merged.publishDate || '',
          merged.publishedAt || '',
          merged.url || '',
          merged.youtubeUrl || '',
          merged.description || '',
          merged.image || '',
          merged.category || 'News',
          JSON.stringify(merged.tags || []),
          merged.channelName || 'News for All',
          merged.channelLogo || '',
          merged.seoTitle || merged.title,
          merged.seoDescription || '',
          merged.likes,
          merged.dislikes,
          merged.isFeatured ? 1 : 0,
          id
        ]
      );

      // Sync local backup
      const articles = readLocalData(NEWS_FILE);
      const idx = articles.findIndex(a => a._id === id);
      if (idx !== -1) {
        articles[idx] = merged;
        writeLocalData(NEWS_FILE, articles);
      }

      broadcastRealtimeEvent('news_updated', merged);
      return res.json({ success: true, data: merged });
    } else if (getIsMongoConnected()) {
      const updated = await News.findByIdAndUpdate(id, updates, { new: true });
      if (!updated) return res.status(404).json({ success: false, error: 'Post not found' });
      broadcastRealtimeEvent('news_updated', updated);
      return res.json({ success: true, data: updated });
    } else {
      const articles = readLocalData(NEWS_FILE);
      const idx = articles.findIndex(a => a._id === id);
      if (idx === -1) return res.status(404).json({ success: false, error: 'Post not found' });

      articles[idx] = {
        ...articles[idx],
        ...updates,
        likes: updates.likes !== undefined ? parseInt(updates.likes) || 0 : articles[idx].likes,
        dislikes: updates.dislikes !== undefined ? parseInt(updates.dislikes) || 0 : articles[idx].dislikes,
        isFeatured: updates.isFeatured !== undefined ? (updates.isFeatured === true || updates.isFeatured === 'true') : articles[idx].isFeatured
      };
      writeLocalData(NEWS_FILE, articles);
      broadcastRealtimeEvent('news_updated', articles[idx]);
      return res.json({ success: true, data: articles[idx] });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST like or dislike reaction
router.post('/:id/react', async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    if (getIsMySQLConnected()) {
      const pool = getMySQLPool();
      const col = type === 'like' ? 'likes' : 'dislikes';
      await pool.query(`UPDATE news SET ${col} = ${col} + 1 WHERE _id = ?`, [id]);
      const [rows] = await pool.query('SELECT * FROM news WHERE _id = ? LIMIT 1', [id]);
      if (rows.length === 0) return res.status(404).json({ success: false, error: 'Post not found' });
      const updated = normalizeNewsRow(rows[0]);
      broadcastRealtimeEvent('news_reacted', updated);
      return res.json({ success: true, data: updated });
    } else if (getIsMongoConnected()) {
      const update = type === 'like' ? { $inc: { likes: 1 } } : { $inc: { dislikes: 1 } };
      const updated = await News.findByIdAndUpdate(id, update, { new: true });
      broadcastRealtimeEvent('news_reacted', updated);
      return res.json({ success: true, data: updated });
    } else {
      const articles = readLocalData(NEWS_FILE);
      const idx = articles.findIndex(a => a._id === id);
      if (idx !== -1) {
        if (type === 'like') articles[idx].likes = (articles[idx].likes || 0) + 1;
        if (type === 'dislike') articles[idx].dislikes = (articles[idx].dislikes || 0) + 1;
        writeLocalData(NEWS_FILE, articles);
        broadcastRealtimeEvent('news_reacted', articles[idx]);
        return res.json({ success: true, data: articles[idx] });
      }
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE news item by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsMySQLConnected()) {
      const pool = getMySQLPool();
      await pool.query('DELETE FROM news WHERE _id = ?', [id]);
      let articles = readLocalData(NEWS_FILE);
      articles = articles.filter(a => a._id !== id);
      writeLocalData(NEWS_FILE, articles);
      broadcastRealtimeEvent('news_deleted', { _id: id });
      return res.json({ success: true, message: 'Post deleted successfully' });
    } else if (getIsMongoConnected()) {
      await News.findByIdAndDelete(id);
      broadcastRealtimeEvent('news_deleted', { _id: id });
      return res.json({ success: true, message: 'Post deleted successfully' });
    } else {
      let articles = readLocalData(NEWS_FILE);
      articles = articles.filter(a => a._id !== id);
      writeLocalData(NEWS_FILE, articles);
      broadcastRealtimeEvent('news_deleted', { _id: id });
      return res.json({ success: true, message: 'Post deleted successfully' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
