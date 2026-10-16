import express from 'express';
import Settings from '../models/Settings.js';
import {
  getIsMySQLConnected,
  getMySQLPool,
  getIsMongoConnected,
  SETTINGS_FILE,
  readLocalData,
  writeLocalData
} from '../config/db.js';
import { broadcastRealtimeEvent } from '../realtime.js';

const router = express.Router();

export const defaultSettings = {
  _id: 'site_settings_main',
  siteName: 'News for All',
  siteTagline: 'THE GLOBAL CHRONICLE • INDEPENDENT STORIES, NEWS & EDITORIAL ARTICLES',
  siteEdition: 'VOL. XCIV • INTERNATIONAL EDITION',
  logoUrl: '',
  metaTitle: 'News for All — Modern Vintage Editorial & Global News Blog',
  metaDescription: 'An independent modern-vintage publication dedicated to breaking news, investigative stories, cultural essays, and video journalism.',
  metaKeywords: 'news, blog, stories, articles, investigative journalism, video news, world, politics, culture',
  ogImage: '',
  categories: ['All', 'News', 'Stories', 'Articles', 'World', 'Politics', 'Culture', 'Technology', 'Opinion', 'Video'],
  postFormats: ['News', 'Story', 'Article', 'Editorial', 'Video'],
  theme: {
    bgColor: '#FBF8F3',
    cardBg: '#FFFDF9',
    textColor: '#181615',
    accentColor: '#9E2A2B',
    secondaryText: '#5C554E',
    borderColor: '#D8CFC2',
    presetName: 'Classic Broadsheet'
  },
  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    medium: 'https://medium.com',
    youtube: 'https://youtube.com',
    twitter: 'https://x.com'
  },
  footerText: '© 2026 News for All Chronicle. Printed & Published Digitally Worldwide. All Rights Reserved.'
};

const parseJSONField = (val, fallback) => {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch (e) {
    return fallback;
  }
};

const normalizeSettingsRow = (row) => {
  if (!row) return defaultSettings;
  return {
    ...defaultSettings,
    ...row,
    categories: parseJSONField(row.categories, defaultSettings.categories),
    postFormats: parseJSONField(row.postFormats, defaultSettings.postFormats),
    theme: {
      ...defaultSettings.theme,
      ...parseJSONField(row.theme, defaultSettings.theme)
    },
    socialLinks: {
      ...defaultSettings.socialLinks,
      ...parseJSONField(row.socialLinks, defaultSettings.socialLinks)
    }
  };
};

// GET site settings
router.get('/', async (req, res) => {
  try {
    if (getIsMySQLConnected()) {
      const pool = getMySQLPool();
      const [rows] = await pool.query('SELECT * FROM settings WHERE _id = ? LIMIT 1', ['site_settings_main']);
      if (rows.length === 0) {
        await pool.query(
          `INSERT INTO settings (_id, siteName, siteTagline, siteEdition, logoUrl, metaTitle, metaDescription, metaKeywords, ogImage, categories, postFormats, theme, socialLinks, footerText)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            defaultSettings._id,
            defaultSettings.siteName,
            defaultSettings.siteTagline,
            defaultSettings.siteEdition,
            defaultSettings.logoUrl,
            defaultSettings.metaTitle,
            defaultSettings.metaDescription,
            defaultSettings.metaKeywords,
            defaultSettings.ogImage,
            JSON.stringify(defaultSettings.categories),
            JSON.stringify(defaultSettings.postFormats),
            JSON.stringify(defaultSettings.theme),
            JSON.stringify(defaultSettings.socialLinks),
            defaultSettings.footerText
          ]
        );
        return res.json({ success: true, data: defaultSettings });
      }
      return res.json({ success: true, data: normalizeSettingsRow(rows[0]) });
    } else if (getIsMongoConnected()) {
      let settings = await Settings.findOne();
      if (!settings) {
        settings = await Settings.create(defaultSettings);
      }
      return res.json({ success: true, data: settings });
    } else {
      let settings = readLocalData(SETTINGS_FILE);
      if (!settings || Array.isArray(settings) || !settings.siteName) {
        settings = defaultSettings;
        writeLocalData(SETTINGS_FILE, settings);
      } else {
        if (!settings.postFormats || !Array.isArray(settings.postFormats)) {
          settings.postFormats = defaultSettings.postFormats;
        }
        if (!settings.categories || !Array.isArray(settings.categories)) {
          settings.categories = defaultSettings.categories;
        }
      }
      return res.json({ success: true, data: settings });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update site settings (Categories, Post Formats, Branding, SEO, Theme)
router.put('/', async (req, res) => {
  try {
    const updates = req.body;

    if (getIsMySQLConnected()) {
      const pool = getMySQLPool();
      const [rows] = await pool.query('SELECT * FROM settings WHERE _id = ? LIMIT 1', ['site_settings_main']);
      const current = rows.length > 0 ? normalizeSettingsRow(rows[0]) : defaultSettings;

      const merged = {
        ...current,
        ...updates,
        categories: Array.isArray(updates.categories) ? updates.categories : current.categories,
        postFormats: Array.isArray(updates.postFormats) ? updates.postFormats : current.postFormats,
        theme: { ...current.theme, ...(updates.theme || {}) },
        socialLinks: { ...current.socialLinks, ...(updates.socialLinks || {}) }
      };

      await pool.query(
        `INSERT INTO settings (_id, siteName, siteTagline, siteEdition, logoUrl, metaTitle, metaDescription, metaKeywords, ogImage, categories, postFormats, theme, socialLinks, footerText)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           siteName = VALUES(siteName),
           siteTagline = VALUES(siteTagline),
           siteEdition = VALUES(siteEdition),
           logoUrl = VALUES(logoUrl),
           metaTitle = VALUES(metaTitle),
           metaDescription = VALUES(metaDescription),
           metaKeywords = VALUES(metaKeywords),
           ogImage = VALUES(ogImage),
           categories = VALUES(categories),
           postFormats = VALUES(postFormats),
           theme = VALUES(theme),
           socialLinks = VALUES(socialLinks),
           footerText = VALUES(footerText)`,
        [
          'site_settings_main',
          merged.siteName,
          merged.siteTagline,
          merged.siteEdition,
          merged.logoUrl,
          merged.metaTitle,
          merged.metaDescription,
          merged.metaKeywords,
          merged.ogImage || '',
          JSON.stringify(merged.categories),
          JSON.stringify(merged.postFormats),
          JSON.stringify(merged.theme),
          JSON.stringify(merged.socialLinks),
          merged.footerText
        ]
      );

      // Keep local backup synced as well
      writeLocalData(SETTINGS_FILE, merged);
      broadcastRealtimeEvent('settings_updated', merged);
      return res.json({ success: true, data: merged });
    } else if (getIsMongoConnected()) {
      let settings = await Settings.findOne();
      if (!settings) {
        settings = await Settings.create({ ...defaultSettings, ...updates });
      } else {
        Object.assign(settings, updates, { updatedAt: new Date() });
        await settings.save();
      }
      broadcastRealtimeEvent('settings_updated', settings);
      return res.json({ success: true, data: settings });
    } else {
      let current = readLocalData(SETTINGS_FILE);
      if (!current || Array.isArray(current) || !current.siteName) {
        current = defaultSettings;
      }
      const updated = {
        ...current,
        ...updates,
        categories: Array.isArray(updates.categories) ? updates.categories : (current.categories || defaultSettings.categories),
        postFormats: Array.isArray(updates.postFormats) ? updates.postFormats : (current.postFormats || defaultSettings.postFormats),
        theme: { ...(current.theme || defaultSettings.theme), ...(updates.theme || {}) },
        socialLinks: { ...(current.socialLinks || defaultSettings.socialLinks), ...(updates.socialLinks || {}) },
        updatedAt: new Date().toISOString()
      };
      writeLocalData(SETTINGS_FILE, updated);
      broadcastRealtimeEvent('settings_updated', updated);
      return res.json({ success: true, data: updated });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
