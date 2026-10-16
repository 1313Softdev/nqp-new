import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const NewsContext = createContext();

// Helper for safe JSON fetching
const fetchJSON = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      console.warn(`HTTP error! status: ${res.status} for ${url}`);
      return { success: false, error: `HTTP ${res.status}` };
    }
    const text = await res.text();
    if (!text || !text.trim()) {
      return { success: false, error: 'Empty response' };
    }
    return JSON.parse(text);
  } catch (err) {
    console.error(`Fetch JSON error for ${url}:`, err);
    return { success: false, error: err.message };
  }
};

// Extract YouTube Video ID from any YouTube URL format
export const extractYouTubeId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[7] && match[7].length === 11) {
    return match[7];
  }
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch && shortsMatch[1]) {
    return shortsMatch[1];
  }
  return null;
};

export const formatEditorialDate = (dateStr) => {
  if (!dateStr) return 'Oct 17, 2026';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const defaultSiteSettings = {
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

export const NewsProvider = ({ children }) => {
  const [channels, setChannels] = useState([]);
  const [news, setNews] = useState([]);
  const [featuredNews, setFeaturedNews] = useState([]);
  const [siteSettings, setSiteSettings] = useState(defaultSiteSettings);
  const [loading, setLoading] = useState(true);

  // Navigation & Views
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'saved'

  // Filters
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePostType, setActivePostType] = useState('All');
  const [activeChannel, setActiveChannel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Realtime MySQL Status
  const [dbStatus, setDbStatus] = useState({
    engine: 'Connecting...',
    mysqlConnected: false,
    mysqlHost: '127.0.0.1:3309/newsforall',
    realtimeConnected: false
  });

  // Admin & Settings
  const [twoLatestPerChannel, setTwoLatestPerChannel] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState('posts');
  const [editingArticle, setEditingArticle] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('news_admin_auth') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [savedArticles, setSavedArticles] = useState(() => {
    try {
      const saved = localStorage.getItem('news_saved_articles');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const loginAdmin = () => {
    setIsAdminLoggedIn(true);
    try {
      localStorage.setItem('news_admin_auth', 'true');
    } catch (e) {}
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem('news_admin_auth');
    } catch (e) {}
    setIsAdminOpen(false);
    setEditingArticle(null);
  };

  // Apply CSS Theme Variables & Document SEO Meta tags dynamically
  useEffect(() => {
    const theme = siteSettings?.theme || defaultSiteSettings.theme;
    const root = document.documentElement;
    root.style.setProperty('--bg-color', theme.bgColor || '#FBF8F3');
    root.style.setProperty('--card-bg', theme.cardBg || '#FFFDF9');
    root.style.setProperty('--text-color', theme.textColor || '#181615');
    root.style.setProperty('--accent-color', theme.accentColor || '#9E2A2B');
    root.style.setProperty('--secondary-text', theme.secondaryText || '#5C554E');
    root.style.setProperty('--border-color', theme.borderColor || '#D8CFC2');

    const title = selectedArticle
      ? `${selectedArticle.seoTitle || selectedArticle.title} — ${siteSettings.siteName}`
      : (siteSettings.metaTitle || `${siteSettings.siteName} — Editorial Blog`);
    document.title = title;

    const setMeta = (selector, attr, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (selector.includes('property=')) {
          el.setAttribute('property', selector.match(/property="([^"]+)"/)[1]);
        } else if (selector.includes('name=')) {
          el.setAttribute('name', selector.match(/name="([^"]+)"/)[1]);
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value || '');
    };

    const desc = selectedArticle
      ? (selectedArticle.seoDescription || selectedArticle.subtitle || selectedArticle.description?.substring(0, 160) || siteSettings.metaDescription)
      : siteSettings.metaDescription;

    setMeta('meta[name="description"]', 'content', desc);
    setMeta('meta[name="keywords"]', 'content', siteSettings.metaKeywords);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', desc);
    if (selectedArticle?.image || siteSettings.ogImage) {
      setMeta('meta[property="og:image"]', 'content', selectedArticle?.image || siteSettings.ogImage);
    }
  }, [siteSettings, selectedArticle]);

  // Fetch Site Settings
  const fetchSettings = useCallback(async () => {
    const json = await fetchJSON('/api/settings');
    if (json.success && json.data) {
      setSiteSettings({
        ...defaultSiteSettings,
        ...json.data,
        categories: Array.isArray(json.data.categories) && json.data.categories.length > 0
          ? json.data.categories
          : defaultSiteSettings.categories,
        postFormats: Array.isArray(json.data.postFormats) && json.data.postFormats.length > 0
          ? json.data.postFormats
          : defaultSiteSettings.postFormats
      });
    }
  }, []);

  // Update Site Settings
  const updateSiteSettings = async (newSettings) => {
    const json = await fetchJSON('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    });
    if (json.success && json.data) {
      setSiteSettings({
        ...defaultSiteSettings,
        ...json.data,
        categories: Array.isArray(json.data.categories) && json.data.categories.length > 0
          ? json.data.categories
          : defaultSiteSettings.categories,
        postFormats: Array.isArray(json.data.postFormats) && json.data.postFormats.length > 0
          ? json.data.postFormats
          : defaultSiteSettings.postFormats
      });
      return { success: true, data: json.data };
    }
    return { success: false, error: json.error || 'Failed to update settings' };
  };

  // Fetch Channels
  const fetchChannels = useCallback(async () => {
    const json = await fetchJSON('/api/channels');
    if (json.success && Array.isArray(json.data)) {
      setChannels(json.data);
    }
  }, []);

  // Fetch News / Blog Articles
  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/api/news?twoLatestPerChannel=${twoLatestPerChannel}`;
      if (activeCategory !== 'All') url += `&category=${encodeURIComponent(activeCategory)}`;
      if (activePostType !== 'All') url += `&postType=${encodeURIComponent(activePostType)}`;
      if (activeChannel !== 'All') url += `&channel=${encodeURIComponent(activeChannel)}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const json = await fetchJSON(url);
      if (json.success && Array.isArray(json.data)) {
        setNews(json.data);
      }

      const featJson = await fetchJSON('/api/news?featured=true');
      if (featJson.success && Array.isArray(featJson.data)) {
        setFeaturedNews(featJson.data);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, activePostType, activeChannel, searchQuery, twoLatestPerChannel]);

  const fetchNewsRef = useRef(fetchNews);
  useEffect(() => {
    fetchNewsRef.current = fetchNews;
  }, [fetchNews]);

  useEffect(() => {
    fetchSettings();
    fetchChannels();
  }, [fetchSettings, fetchChannels]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Connect to Real-Time SSE Stream (/api/realtime/stream)
  useEffect(() => {
    let es;
    try {
      es = new EventSource('/api/realtime/stream');
      es.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.engine) {
            setDbStatus((prev) => ({
              ...prev,
              engine: payload.engine,
              mysqlConnected: Boolean(payload.mysqlConnected),
              mysqlHost: payload.mysqlHost || prev.mysqlHost,
              realtimeConnected: true
            }));
          }

          if (
            payload.type === 'news_created' ||
            payload.type === 'news_updated' ||
            payload.type === 'news_deleted' ||
            payload.type === 'news_reacted'
          ) {
            fetchNewsRef.current?.();
          } else if (payload.type === 'settings_updated' && payload.data) {
            setSiteSettings((prev) => ({
              ...prev,
              ...payload.data,
              categories: Array.isArray(payload.data.categories) ? payload.data.categories : prev.categories,
              postFormats: Array.isArray(payload.data.postFormats) ? payload.data.postFormats : prev.postFormats
            }));
          } else if (payload.type === 'channels_updated') {
            fetchChannels();
          }
        } catch (err) {
          console.error('SSE parse error:', err);
        }
      };

      es.onerror = () => {
        setDbStatus((prev) => ({ ...prev, realtimeConnected: false }));
      };
    } catch (e) {
      console.warn('EventSource not supported:', e);
    }

    return () => {
      if (es) es.close();
    };
  }, [fetchChannels]);

  // Handle Like/Dislike reaction
  const handleReact = async (id, type) => {
    const json = await fetchJSON(`/api/news/${id}/react`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type })
    });
    if (json.success && json.data) {
      setNews(prev => prev.map(item => item._id === id ? json.data : item));
      setFeaturedNews(prev => prev.map(item => item._id === id ? json.data : item));
      if (selectedArticle && selectedArticle._id === id) {
        setSelectedArticle(json.data);
      }
    }
  };

  // Admin Channel Actions
  const addChannel = async (channelData) => {
    const json = await fetchJSON('/api/channels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(channelData)
    });
    if (json.success) {
      await fetchChannels();
      return { success: true };
    }
    return { success: false, error: json.error || 'Failed to add channel' };
  };

  const updateChannel = async (id, channelData) => {
    const json = await fetchJSON(`/api/channels/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(channelData)
    });
    if (json.success) {
      await fetchChannels();
      return { success: true };
    }
    return { success: false, error: json.error || 'Failed to update channel' };
  };

  const deleteChannel = async (id) => {
    const json = await fetchJSON(`/api/channels/${id}`, { method: 'DELETE' });
    if (json.success) {
      await fetchChannels();
    }
  };

  // Admin News/Blog Post Actions
  const addNewsPost = async (newsData) => {
    const json = await fetchJSON('/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newsData)
    });
    if (json.success) {
      await fetchNews();
      return { success: true, data: json.data };
    }
    return { success: false, error: json.error || 'Failed to post article' };
  };

  const updateNewsPost = async (id, newsData) => {
    const json = await fetchJSON(`/api/news/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newsData)
    });
    if (json.success) {
      await fetchNews();
      if (selectedArticle && selectedArticle._id === id) {
        setSelectedArticle(json.data);
      }
      return { success: true, data: json.data };
    }
    return { success: false, error: json.error || 'Failed to update article' };
  };

  const deleteNewsPost = async (id) => {
    const json = await fetchJSON(`/api/news/${id}`, { method: 'DELETE' });
    if (json.success) {
      if (selectedArticle && selectedArticle._id === id) {
        setSelectedArticle(null);
      }
      await fetchNews();
    }
  };

  const openEditArticleModal = (article) => {
    setEditingArticle(article);
    setAdminInitialTab('posts');
    setIsAdminOpen(true);
  };

  const toggleBookmark = (article) => {
    setSavedArticles(prev => {
      const exists = prev.some(a => a._id === article._id);
      const updated = exists ? prev.filter(a => a._id !== article._id) : [...prev, article];
      try {
        localStorage.setItem('news_saved_articles', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  return (
    <NewsContext.Provider
      value={{
        channels,
        news,
        featuredNews,
        siteSettings,
        updateSiteSettings,
        dbStatus,
        loading,
        activeTab,
        setActiveTab,
        activeCategory,
        setActiveCategory,
        activePostType,
        setActivePostType,
        activeChannel,
        setActiveChannel,
        searchQuery,
        setSearchQuery,
        twoLatestPerChannel,
        setTwoLatestPerChannel,
        isAdminOpen,
        setIsAdminOpen,
        adminInitialTab,
        setAdminInitialTab,
        editingArticle,
        setEditingArticle,
        openEditArticleModal,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        selectedArticle,
        setSelectedArticle,
        savedArticles,
        toggleBookmark,
        toggleSaveArticle: toggleBookmark,
        formatEditorialDate,
        handleReact,
        addChannel,
        updateChannel,
        deleteChannel,
        addNewsPost,
        updateNewsPost,
        deleteNewsPost,
        fetchNews,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => useContext(NewsContext);
