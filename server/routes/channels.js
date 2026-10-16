import express from 'express';
import Channel from '../models/Channel.js';
import {
  getIsMySQLConnected,
  getMySQLPool,
  getIsMongoConnected,
  CHANNELS_FILE,
  readLocalData,
  writeLocalData
} from '../config/db.js';
import { broadcastRealtimeEvent } from '../realtime.js';

const router = express.Router();

// GET all channels
router.get('/', async (req, res) => {
  try {
    if (getIsMySQLConnected()) {
      const pool = getMySQLPool();
      const [rows] = await pool.query('SELECT * FROM channels ORDER BY createdAt DESC');
      return res.json({ success: true, count: rows.length, data: rows });
    } else if (getIsMongoConnected()) {
      const channels = await Channel.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: channels.length, data: channels });
    } else {
      const channels = readLocalData(CHANNELS_FILE);
      return res.json({ success: true, count: channels.length, data: channels });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST add new channel (Admin)
router.post('/', async (req, res) => {
  try {
    const { name, logo, url, description } = req.body;
    if (!name || !url) {
      return res.status(400).json({ success: false, error: 'Channel name and URL are required' });
    }

    const defaultLogo = logo || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=120&h=120&fit=crop';
    const newChannel = {
      _id: 'chan_' + Date.now(),
      name,
      logo: defaultLogo,
      url,
      description: description || `${name} News Channel`,
      createdAt: new Date().toISOString()
    };

    if (getIsMySQLConnected()) {
      const pool = getMySQLPool();
      await pool.query(
        'INSERT INTO channels (_id, name, logo, url, description, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
        [newChannel._id, newChannel.name, newChannel.logo, newChannel.url, newChannel.description, new Date()]
      );
      const channels = readLocalData(CHANNELS_FILE);
      channels.unshift(newChannel);
      writeLocalData(CHANNELS_FILE, channels);
      broadcastRealtimeEvent('channels_updated', newChannel);
      return res.status(201).json({ success: true, data: newChannel });
    } else if (getIsMongoConnected()) {
      const created = await Channel.create({
        name,
        logo: defaultLogo,
        url,
        description: description || `${name} News Channel`
      });
      broadcastRealtimeEvent('channels_updated', created);
      return res.status(201).json({ success: true, data: created });
    } else {
      const channels = readLocalData(CHANNELS_FILE);
      channels.unshift(newChannel);
      writeLocalData(CHANNELS_FILE, channels);
      broadcastRealtimeEvent('channels_updated', newChannel);
      return res.status(201).json({ success: true, data: newChannel });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT edit channel by ID (Admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, logo, url, description } = req.body;

    if (getIsMySQLConnected()) {
      const pool = getMySQLPool();
      const [rows] = await pool.query('SELECT * FROM channels WHERE _id = ? LIMIT 1', [id]);
      if (rows.length === 0) return res.status(404).json({ success: false, error: 'Channel not found' });
      const existing = rows[0];
      const updated = {
        ...existing,
        name: name || existing.name,
        logo: logo || existing.logo,
        url: url || existing.url,
        description: description !== undefined ? description : existing.description
      };
      await pool.query(
        'UPDATE channels SET name = ?, logo = ?, url = ?, description = ? WHERE _id = ?',
        [updated.name, updated.logo, updated.url, updated.description, id]
      );
      const channels = readLocalData(CHANNELS_FILE);
      const idx = channels.findIndex(c => c._id === id);
      if (idx !== -1) {
        channels[idx] = updated;
        writeLocalData(CHANNELS_FILE, channels);
      }
      broadcastRealtimeEvent('channels_updated', updated);
      return res.json({ success: true, data: updated });
    } else if (getIsMongoConnected()) {
      const updated = await Channel.findByIdAndUpdate(
        id,
        { name, logo, url, description },
        { new: true }
      );
      if (!updated) return res.status(404).json({ success: false, error: 'Channel not found' });
      broadcastRealtimeEvent('channels_updated', updated);
      return res.json({ success: true, data: updated });
    } else {
      const channels = readLocalData(CHANNELS_FILE);
      const idx = channels.findIndex(c => c._id === id);
      if (idx === -1) return res.status(404).json({ success: false, error: 'Channel not found' });
      channels[idx] = {
        ...channels[idx],
        name: name || channels[idx].name,
        logo: logo || channels[idx].logo,
        url: url || channels[idx].url,
        description: description !== undefined ? description : channels[idx].description
      };
      writeLocalData(CHANNELS_FILE, channels);
      broadcastRealtimeEvent('channels_updated', channels[idx]);
      return res.json({ success: true, data: channels[idx] });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE channel by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsMySQLConnected()) {
      const pool = getMySQLPool();
      await pool.query('DELETE FROM channels WHERE _id = ?', [id]);
      let channels = readLocalData(CHANNELS_FILE);
      channels = channels.filter(c => c._id !== id);
      writeLocalData(CHANNELS_FILE, channels);
      broadcastRealtimeEvent('channels_updated', { _id: id, deleted: true });
      return res.json({ success: true, message: 'Channel deleted successfully' });
    } else if (getIsMongoConnected()) {
      await Channel.findByIdAndDelete(id);
      broadcastRealtimeEvent('channels_updated', { _id: id, deleted: true });
      return res.json({ success: true, message: 'Channel deleted successfully' });
    } else {
      let channels = readLocalData(CHANNELS_FILE);
      channels = channels.filter(c => c._id !== id);
      writeLocalData(CHANNELS_FILE, channels);
      broadcastRealtimeEvent('channels_updated', { _id: id, deleted: true });
      return res.json({ success: true, message: 'Channel deleted successfully' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
