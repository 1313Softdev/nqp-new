import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ShieldCheck,
  PlusCircle,
  Rss,
  FileText,
  Trash2,
  Edit3,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Upload,
  Palette,
  Globe,
  Search,
  Youtube,
  Database,
  Save
} from 'lucide-react';
import { useNews, extractYouTubeId } from '../context/NewsContext';

// Client-side image compressor utility
const compressImage = (file, maxWidth = 1200, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(event.target.result);
    };
    reader.onerror = (err) => reject(err);
  });
};

const THEME_PRESETS = [
  {
    name: 'Classic Broadsheet',
    bgColor: '#FBF8F3',
    cardBg: '#FFFDF9',
    textColor: '#181615',
    accentColor: '#9E2A2B',
    secondaryText: '#5C554E',
    borderColor: '#D8CFC2'
  },
  {
    name: 'Royal Oxford Gazette',
    bgColor: '#F4F6F8',
    cardBg: '#FFFFFF',
    textColor: '#0F172A',
    accentColor: '#1E3A8A',
    secondaryText: '#475569',
    borderColor: '#CBD5E1'
  },
  {
    name: 'British Racing Chronicle',
    bgColor: '#F6F7F4',
    cardBg: '#FCFDFB',
    textColor: '#14241B',
    accentColor: '#1B4332',
    secondaryText: '#4A5D52',
    borderColor: '#CCD5CE'
  },
  {
    name: 'Sepia Literary Review',
    bgColor: '#F4ECE1',
    cardBg: '#FAF5EE',
    textColor: '#2B2118',
    accentColor: '#A44A3F',
    secondaryText: '#6F5E53',
    borderColor: '#D5C5B5'
  },
  {
    name: 'Midnight Noir Press',
    bgColor: '#121316',
    cardBg: '#1A1C20',
    textColor: '#F3EFEA',
    accentColor: '#E09F3E',
    secondaryText: '#A09A90',
    manageBg: '#1A1C20',
    borderColor: '#2E323B'
  }
];

export default function AdminModal() {
  const {
    isAdminOpen,
    setIsAdminOpen,
    adminInitialTab,
    editingArticle,
    setEditingArticle,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    channels,
    news,
    siteSettings,
    updateSiteSettings,
    dbStatus,
    addChannel,
    updateChannel,
    deleteChannel,
    addNewsPost,
    updateNewsPost,
    deleteNewsPost
  } = useNews();

  const [passkey, setPasskey] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'manage', 'channels', 'branding', 'seo', 'colors'
  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', msg: '' });

  // Post Form State (Create or Edit)
  const [editingId, setEditingId] = useState(null);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsSubtitle, setNewsSubtitle] = useState('');
  const [newsPostType, setNewsPostType] = useState('Article');
  const [newsAuthor, setNewsAuthor] = useState('Editorial Desk');
  const [newsReadTime, setNewsReadTime] = useState('5 min read');
  const [newsPublishDate, setNewsPublishDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newsUrl, setNewsUrl] = useState('');
  const [newsYoutubeUrl, setNewsYoutubeUrl] = useState('');
  const [newsDescription, setNewsDescription] = useState('');
  const [newsImage, setNewsImage] = useState('');
  const [newsImageMode, setNewsImageMode] = useState('upload');
  const [newsImageName, setNewsImageName] = useState('');
  const [newsCategory, setNewsCategory] = useState('News');
  const [newsTags, setNewsTags] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('News for All');
  const [newsSeoTitle, setNewsSeoTitle] = useState('');
  const [newsSeoDescription, setNewsSeoDescription] = useState('');
  const [newsLikes, setNewsLikes] = useState('120');
  const [newsDislikes, setNewsDislikes] = useState('4');
  const [newsFeatured, setNewsFeatured] = useState(false);
  const newsFileRef = useRef(null);

  // Quick Inline Add Category & Post Format inside Write Post Tab
  const [showQuickAddFormat, setShowQuickAddFormat] = useState(false);
  const [quickFormatName, setQuickFormatName] = useState('');
  const [showQuickAddCategory, setShowQuickAddCategory] = useState(false);
  const [quickCategoryName, setQuickCategoryName] = useState('');

  // Channel Form State
  const [editingChannelId, setEditingChannelId] = useState(null);
  const [channelName, setChannelName] = useState('');
  const [channelLogo, setChannelLogo] = useState('');
  const [channelLogoMode, setChannelLogoMode] = useState('upload');
  const [channelLogoName, setChannelLogoName] = useState('');
  const [channelUrl, setChannelUrl] = useState('');
  const [channelDesc, setChannelDesc] = useState('');
  const channelFileRef = useRef(null);

  // Site Settings State (Branding, Categories, Post Formats, SEO, Colors, Social)
  const [siteName, setSiteName] = useState('');
  const [siteTagline, setSiteTagline] = useState('');
  const [siteEdition, setSiteEdition] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoMode, setLogoMode] = useState('upload');
  const [footerText, setFooterText] = useState('');
  const [categoriesList, setCategoriesList] = useState([]);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [postFormatsList, setPostFormatsList] = useState([]);
  const [newPostFormatInput, setNewPostFormatInput] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [themeColors, setThemeColors] = useState(THEME_PRESETS[0]);
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    instagram: '',
    linkedin: '',
    medium: '',
    youtube: '',
    twitter: ''
  });
  const logoFileRef = useRef(null);

  // Sync tab when modal opens
  useEffect(() => {
    if (isAdminOpen && adminInitialTab) {
      setActiveTab(adminInitialTab);
    }
  }, [isAdminOpen, adminInitialTab]);

  // Populate Post Form if editing an existing article
  useEffect(() => {
    if (editingArticle) {
      setEditingId(editingArticle._id);
      setNewsTitle(editingArticle.title || '');
      setNewsSubtitle(editingArticle.subtitle || '');
      setNewsPostType(editingArticle.postType || 'Article');
      setNewsAuthor(editingArticle.author || 'Editorial Desk');
      setNewsReadTime(editingArticle.readTime || '5 min read');
      setNewsPublishDate(editingArticle.publishDate || new Date().toISOString().split('T')[0]);
      setNewsUrl(editingArticle.url || '');
      setNewsYoutubeUrl(editingArticle.youtubeUrl || '');
      setNewsDescription(editingArticle.description || '');
      setNewsImage(editingArticle.image || '');
      setNewsCategory(editingArticle.category || 'News');
      setNewsTags(Array.isArray(editingArticle.tags) ? editingArticle.tags.join(', ') : '');
      setSelectedChannel(editingArticle.channelName || 'News for All');
      setNewsSeoTitle(editingArticle.seoTitle || '');
      setNewsSeoDescription(editingArticle.seoDescription || '');
      setNewsLikes(String(editingArticle.likes ?? 0));
      setNewsDislikes(String(editingArticle.dislikes ?? 0));
      setNewsFeatured(Boolean(editingArticle.isFeatured));
      setActiveTab('posts');
    } else {
      resetPostForm();
    }
  }, [editingArticle]);

  // Sync Site Settings state
  useEffect(() => {
    if (siteSettings) {
      setSiteName(siteSettings.siteName || 'News for All');
      setSiteTagline(siteSettings.siteTagline || '');
      setSiteEdition(siteSettings.siteEdition || '');
      setLogoUrl(siteSettings.logoUrl || '');
      setFooterText(siteSettings.footerText || '');
      setCategoriesList(siteSettings.categories || ['All', 'News', 'Stories', 'Articles']);
      setPostFormatsList(siteSettings.postFormats || ['News', 'Story', 'Article', 'Editorial', 'Video']);
      setMetaTitle(siteSettings.metaTitle || '');
      setMetaDescription(siteSettings.metaDescription || '');
      setMetaKeywords(siteSettings.metaKeywords || '');
      if (siteSettings.theme) setThemeColors(siteSettings.theme);
      if (siteSettings.socialLinks) setSocialLinks(siteSettings.socialLinks);
    }
  }, [siteSettings]);

  const resetPostForm = () => {
    setEditingId(null);
    setNewsTitle('');
    setNewsSubtitle('');
    setNewsPostType(siteSettings?.postFormats?.[0] || 'Article');
    setNewsAuthor('Editorial Desk');
    setNewsReadTime('5 min read');
    setNewsPublishDate(new Date().toISOString().split('T')[0]);
    setNewsUrl('');
    setNewsYoutubeUrl('');
    setNewsDescription('');
    setNewsImage('');
    setNewsImageName('');
    setNewsCategory('News');
    setNewsTags('');
    setSelectedChannel(channels[0]?.name || 'News for All');
    setNewsSeoTitle('');
    setNewsSeoDescription('');
    setNewsLikes('120');
    setNewsDislikes('4');
    setNewsFeatured(false);
    if (newsFileRef.current) newsFileRef.current.value = '';
  };

  if (!isAdminOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passkey })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        loginAdmin();
        setLoginError('');
        setPasskey('');
      } else {
        setLoginError('Invalid Passkey. Access Denied.');
      }
    } catch (err) {
      setLoginError('Authentication failed. Please try again.');
    }
  };

  // Quick Add Post Format directly from Write Post tab and persist to MySQL
  const handleQuickAddFormat = async () => {
    const trimmed = quickFormatName.trim();
    if (!trimmed) return;
    const currentFormats = siteSettings.postFormats || ['News', 'Story', 'Article', 'Editorial', 'Video'];
    const updatedFormats = currentFormats.includes(trimmed) ? currentFormats : [...currentFormats, trimmed];
    setPostFormatsList(updatedFormats);
    setNewsPostType(trimmed);
    setQuickFormatName('');
    setShowQuickAddFormat(false);
    const res = await updateSiteSettings({ ...siteSettings, postFormats: updatedFormats });
    if (res.success) {
      setFeedbackMessage({ type: 'success', msg: `Added new Post Format "${trimmed}" and saved to MySQL!` });
    }
  };

  // Quick Add Category directly from Write Post tab and persist to MySQL
  const handleQuickAddCategory = async () => {
    const trimmed = quickCategoryName.trim();
    if (!trimmed) return;
    const currentCats = siteSettings.categories || ['All', 'News', 'Stories', 'Articles'];
    const updatedCats = currentCats.includes(trimmed) ? currentCats : [...currentCats, trimmed];
    setCategoriesList(updatedCats);
    setNewsCategory(trimmed);
    setQuickCategoryName('');
    setShowQuickAddCategory(false);
    const res = await updateSiteSettings({ ...siteSettings, categories: updatedCats });
    if (res.success) {
      setFeedbackMessage({ type: 'success', msg: `Added new Category "${trimmed}" and saved to MySQL!` });
    }
  };

  // Image Upload Handlers
  const handleNewsFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setNewsImageName(file.name);
      const dataUrl = await compressImage(file, 1200, 0.85);
      setNewsImage(dataUrl);
    } catch (err) {
      setFeedbackMessage({ type: 'error', msg: 'Failed to process image file' });
    }
  };

  const handleChannelLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setChannelLogoName(file.name);
      const dataUrl = await compressImage(file, 400, 0.9);
      setChannelLogo(dataUrl);
    } catch (err) {
      setFeedbackMessage({ type: 'error', msg: 'Failed to process logo file' });
    }
  };

  const handleSiteLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImage(file, 500, 0.9);
      setLogoUrl(dataUrl);
    } catch (err) {
      setFeedbackMessage({ type: 'error', msg: 'Failed to process site logo' });
    }
  };

  // Submit Create or Edit Post
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newsTitle) {
      setFeedbackMessage({ type: 'error', msg: 'Headline Title is required' });
      return;
    }

    const targetChan = channels.find(c => c.name.toLowerCase() === selectedChannel.toLowerCase());
    const ytId = extractYouTubeId(newsYoutubeUrl);
    const fallbackImg = ytId
      ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
      : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900&auto=format&fit=crop&q=80';

    const payload = {
      title: newsTitle,
      subtitle: newsSubtitle,
      postType: newsPostType,
      author: newsAuthor || 'Editorial Desk',
      readTime: newsReadTime || '5 min read',
      publishDate: newsPublishDate,
      url: newsUrl || '',
      youtubeUrl: newsYoutubeUrl || '',
      description: newsDescription || '',
      image: newsImage || fallbackImg,
      category: newsCategory,
      tags: newsTags,
      channelName: selectedChannel || 'News for All',
      channelLogo: targetChan ? targetChan.logo : '',
      seoTitle: newsSeoTitle || newsTitle,
      seoDescription: newsSeoDescription || newsSubtitle || newsDescription.substring(0, 160),
      likes: parseInt(newsLikes) || 0,
      dislikes: parseInt(newsDislikes) || 0,
      isFeatured: newsFeatured
    };

    let res;
    if (editingId) {
      res = await updateNewsPost(editingId, payload);
      if (res.success) {
        setFeedbackMessage({ type: 'success', msg: `Updated "${newsTitle}" in real-time MySQL database!` });
        setEditingArticle(null);
        resetPostForm();
      }
    } else {
      res = await addNewsPost(payload);
      if (res.success) {
        setFeedbackMessage({ type: 'success', msg: `Published "${newsTitle}" to real-time MySQL database!` });
        resetPostForm();
      }
    }

    if (!res?.success) {
      setFeedbackMessage({ type: 'error', msg: res?.error || 'Failed to save post' });
    }
  };

  // Submit Create or Update Channel
  const handleChannelSubmit = async (e) => {
    e.preventDefault();
    if (!channelName || !channelUrl) {
      setFeedbackMessage({ type: 'error', msg: 'Channel Name and Website URL are required' });
      return;
    }

    const payload = {
      name: channelName,
      logo: channelLogo || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=120&h=120&fit=crop',
      url: channelUrl,
      description: channelDesc
    };

    let res;
    if (editingChannelId) {
      res = await updateChannel(editingChannelId, payload);
      if (res.success) {
        setFeedbackMessage({ type: 'success', msg: `Channel "${channelName}" updated in MySQL!` });
        setEditingChannelId(null);
      }
    } else {
      res = await addChannel(payload);
      if (res.success) {
        setFeedbackMessage({ type: 'success', msg: `Channel "${channelName}" added to MySQL!` });
      }
    }

    if (res?.success) {
      setChannelName('');
      setChannelLogo('');
      setChannelLogoName('');
      setChannelUrl('');
      setChannelDesc('');
      if (channelFileRef.current) channelFileRef.current.value = '';
    } else {
      setFeedbackMessage({ type: 'error', msg: res?.error || 'Failed to save channel' });
    }
  };

  // Save Site Customization Settings
  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    const res = await updateSiteSettings({
      siteName,
      siteTagline,
      siteEdition,
      logoUrl,
      footerText,
      categories: categoriesList,
      postFormats: postFormatsList,
      metaTitle,
      metaDescription,
      metaKeywords,
      theme: themeColors,
      socialLinks
    });

    if (res.success) {
      setFeedbackMessage({ type: 'success', msg: 'Categories, Post Formats, Branding, SEO & Color Theme saved to MySQL live!' });
    } else {
      setFeedbackMessage({ type: 'error', msg: res.error || 'Failed to save settings' });
    }
  };

  const addCategoryToList = async () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    const updated = categoriesList.includes(trimmed) ? categoriesList : [...categoriesList, trimmed];
    setCategoriesList(updated);
    setNewCategoryInput('');
    await updateSiteSettings({
      siteName,
      siteTagline,
      siteEdition,
      logoUrl,
      footerText,
      categories: updated,
      postFormats: postFormatsList,
      metaTitle,
      metaDescription,
      metaKeywords,
      theme: themeColors,
      socialLinks
    });
    setFeedbackMessage({ type: 'success', msg: `Category "${trimmed}" added and synced to MySQL!` });
  };

  const removeCategoryFromList = async (cat) => {
    if (cat === 'All') return;
    const updated = categoriesList.filter(c => c !== cat);
    setCategoriesList(updated);
    await updateSiteSettings({
      siteName,
      siteTagline,
      siteEdition,
      logoUrl,
      footerText,
      categories: updated,
      postFormats: postFormatsList,
      metaTitle,
      metaDescription,
      metaKeywords,
      theme: themeColors,
      socialLinks
    });
    setFeedbackMessage({ type: 'success', msg: `Category "${cat}" removed!` });
  };

  const addPostFormatToList = async () => {
    const trimmed = newPostFormatInput.trim();
    if (!trimmed) return;
    const updated = postFormatsList.includes(trimmed) ? postFormatsList : [...postFormatsList, trimmed];
    setPostFormatsList(updated);
    setNewPostFormatInput('');
    await updateSiteSettings({
      siteName,
      siteTagline,
      siteEdition,
      logoUrl,
      footerText,
      categories: categoriesList,
      postFormats: updated,
      metaTitle,
      metaDescription,
      metaKeywords,
      theme: themeColors,
      socialLinks
    });
    setFeedbackMessage({ type: 'success', msg: `Post Format "${trimmed}" added and synced to MySQL!` });
  };

  const removePostFormatFromList = async (fmt) => {
    if (postFormatsList.length <= 1) return;
    const updated = postFormatsList.filter(f => f !== fmt);
    setPostFormatsList(updated);
    await updateSiteSettings({
      siteName,
      siteTagline,
      siteEdition,
      logoUrl,
      footerText,
      categories: categoriesList,
      postFormats: updated,
      metaTitle,
      metaDescription,
      metaKeywords,
      theme: themeColors,
      socialLinks
    });
    setFeedbackMessage({ type: 'success', msg: `Post Format "${fmt}" removed!` });
  };

  const previewYoutubeId = extractYouTubeId(newsYoutubeUrl);
  const availableCategories = (categoriesList.length > 0 ? categoriesList : ['News', 'Stories', 'Articles', 'World', 'Politics', 'Culture', 'Technology']).filter(c => c !== 'All');
  const availableFormats = postFormatsList.length > 0 ? postFormatsList : ['News', 'Story', 'Article', 'Editorial', 'Video'];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={() => setIsAdminOpen(false)}
    >
      <div
        className="relative bg-white text-stone-900 w-full max-w-5xl border-2 border-stone-800 shadow-2xl my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Studio Header */}
        <div className="bg-stone-900 text-stone-100 px-6 py-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-serif-display text-lg font-bold tracking-wide">
                  {siteSettings.siteName} — Editorial & Site Management Studio
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-mono-meta uppercase">
                  <Database className="w-3 h-3" />
                  {dbStatus?.engine || 'MySQL 8.0 Realtime'}
                </span>
              </div>
              <p className="text-[11px] font-mono-meta uppercase tracking-widest text-stone-400">
                Publish Stories • Custom Categories & Post Formats • Real-Time MySQL Sync • Branding • SEO • Theme Colors
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminLoggedIn && (
              <button
                onClick={logoutAdmin}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-mono-meta uppercase"
              >
                Sign Out
              </button>
            )}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-1.5 bg-stone-800 hover:bg-stone-700 text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isAdminLoggedIn ? (
          /* Login Screen */
          <div className="p-10 text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 border-2 border-stone-900 flex items-center justify-center mx-auto bg-stone-100">
              <KeyRound className="w-8 h-8 text-stone-900" />
            </div>
            <div>
              <h4 className="font-serif-display text-2xl font-bold text-stone-900">Editor-in-Chief Login</h4>
              <p className="text-xs text-stone-500 mt-1 font-mono-meta">
                Enter your editorial passkey to manage articles, categories, post formats, branding, SEO, and theme colors.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="Enter Admin Passkey"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-300 text-sm font-mono-meta focus:outline-none focus:border-stone-900"
                />
                {loginError && <p className="text-xs text-red-600 font-bold mt-2 text-left">{loginError}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-stone-900 hover:bg-stone-800 text-white font-mono-meta uppercase tracking-widest font-bold py-3.5 px-6 text-xs"
              >
                Unlock Editorial Studio
              </button>
            </form>
          </div>
        ) : (
          /* Logged In Studio */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-stone-50">
            {/* Studio Navigation Tabs */}
            <div className="flex border-b border-stone-300 bg-stone-100 px-6 gap-1 shrink-0 overflow-x-auto">
              {[
                { id: 'posts', label: editingId ? '✏️ Edit Story / Post' : '➕ Write / Post Story', icon: FileText },
                { id: 'manage', label: `📚 All Posts (${news.length})`, icon: Edit3 },
                { id: 'branding', label: '🏛️ Categories, Formats & Branding', icon: Globe },
                { id: 'seo', label: '🔍 SEO, Meta & Social Links', icon: Search },
                { id: 'colors', label: '🎨 Vintage Color Designer', icon: Palette },
                { id: 'channels', label: `📡 Desks & Channels (${channels.length})`, icon: Rss },
              ].map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setFeedbackMessage({ type: '', msg: '' });
                    }}
                    className={`py-3 px-4 text-xs font-mono-meta uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                      active
                        ? 'border-stone-900 bg-white text-stone-900 font-bold'
                        : 'border-transparent text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Feedback Banner */}
            {feedbackMessage.msg && (
              <div
                className={`mx-6 mt-4 p-3 border flex items-center justify-between text-xs font-mono-meta ${
                  feedbackMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-400'
                    : 'bg-red-50 text-red-900 border-red-400'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {feedbackMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{feedbackMessage.msg}</span>
                </div>
                <button onClick={() => setFeedbackMessage({ type: '', msg: '' })} className="text-xs underline">
                  Dismiss
                </button>
              </div>
            )}

            {/* Studio Content Area */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* TAB 1: CREATE OR EDIT POST */}
              {activeTab === 'posts' && (
                <form onSubmit={handlePostSubmit} className="space-y-5 bg-white p-6 border border-stone-200">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <h4 className="font-serif-display text-xl font-bold">
                      {editingId ? 'Edit Existing Dispatch / Story' : 'Publish New News, Story, or Video Article'}
                    </h4>
                    {editingId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingArticle(null);
                          resetPostForm();
                        }}
                        className="px-3 py-1 bg-stone-200 hover:bg-stone-300 text-xs font-mono-meta uppercase"
                      >
                        Cancel Edit & Create New
                      </button>
                    )}
                  </div>

                  {/* Row 1: Title & Subtitle */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700 mb-1">
                        Headline / Story Title *
                      </label>
                      <input
                        type="text"
                        value={newsTitle}
                        onChange={(e) => setNewsTitle(e.target.value)}
                        placeholder="e.g. The Renaissance of Independent Print & Digital Longform Journalism"
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 text-sm font-serif-display font-bold focus:outline-none focus:border-stone-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700 mb-1">
                        Subtitle / Standfirst Deck (Summary Lead)
                      </label>
                      <input
                        type="text"
                        value={newsSubtitle}
                        onChange={(e) => setNewsSubtitle(e.target.value)}
                        placeholder="A brief 1-2 sentence deck that appears beneath the headline..."
                        className="w-full px-4 py-2 bg-stone-50 border border-stone-300 text-xs focus:outline-none focus:border-stone-900"
                      />
                    </div>
                  </div>

                  {/* Row 2: Format Type (+ Add), Category (+ Add), Author, Publish Date, Read Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                    {/* Post Format Selector + Quick Add */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700">
                          Post Format
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowQuickAddFormat(!showQuickAddFormat)}
                          className="text-[10px] font-mono-meta font-bold text-red-700 hover:underline"
                        >
                          {showQuickAddFormat ? 'Cancel' : '+ Add New'}
                        </button>
                      </div>
                      <select
                        value={newsPostType}
                        onChange={(e) => setNewsPostType(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 text-xs font-mono-meta"
                      >
                        {availableFormats.map((fmt) => (
                          <option key={fmt} value={fmt}>{fmt}</option>
                        ))}
                      </select>
                      {showQuickAddFormat && (
                        <div className="mt-1.5 flex gap-1">
                          <input
                            type="text"
                            value={quickFormatName}
                            onChange={(e) => setQuickFormatName(e.target.value)}
                            placeholder="e.g. Podcast, Interview"
                            className="flex-1 px-2 py-1 bg-white border border-stone-400 text-xs font-mono-meta min-w-0"
                          />
                          <button
                            type="button"
                            onClick={handleQuickAddFormat}
                            className="px-2 py-1 bg-stone-900 text-white text-[10px] font-mono-meta uppercase font-bold shrink-0"
                          >
                            Add
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Category Selector + Quick Add */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700">
                          Category
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowQuickAddCategory(!showQuickAddCategory)}
                          className="text-[10px] font-mono-meta font-bold text-red-700 hover:underline"
                        >
                          {showQuickAddCategory ? 'Cancel' : '+ Add New'}
                        </button>
                      </div>
                      <select
                        value={newsCategory}
                        onChange={(e) => setNewsCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 text-xs font-mono-meta"
                      >
                        {availableCategories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {showQuickAddCategory && (
                        <div className="mt-1.5 flex gap-1">
                          <input
                            type="text"
                            value={quickCategoryName}
                            onChange={(e) => setQuickCategoryName(e.target.value)}
                            placeholder="e.g. Science, Sports"
                            className="flex-1 px-2 py-1 bg-white border border-stone-400 text-xs font-mono-meta min-w-0"
                          />
                          <button
                            type="button"
                            onClick={handleQuickAddCategory}
                            className="px-2 py-1 bg-stone-900 text-white text-[10px] font-mono-meta uppercase font-bold shrink-0"
                          >
                            Add
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700 mb-1">
                        Author / Byline
                      </label>
                      <input
                        type="text"
                        value={newsAuthor}
                        onChange={(e) => setNewsAuthor(e.target.value)}
                        placeholder="Eleanor Vance"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700 mb-1">
                        Publication Date
                      </label>
                      <input
                        type="date"
                        value={newsPublishDate}
                        onChange={(e) => setNewsPublishDate(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 text-xs font-mono-meta"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700 mb-1">
                        Reading Time
                      </label>
                      <input
                        type="text"
                        value={newsReadTime}
                        onChange={(e) => setNewsReadTime(e.target.value)}
                        placeholder="5 min read"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 text-xs font-mono-meta"
                      />
                    </div>
                  </div>

                  {/* Row 3: Full Article / Story Body */}
                  <div>
                    <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700 mb-1">
                      Full Article / Story Body Content
                    </label>
                    <textarea
                      value={newsDescription}
                      onChange={(e) => setNewsDescription(e.target.value)}
                      placeholder="Write or paste the complete article, investigative story, or news report here. Separate paragraphs with a blank line..."
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-300 text-sm font-editorial leading-relaxed h-44 resize-y focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  {/* Row 4: YouTube Video URL + External Source URL */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 border border-stone-200">
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-mono-meta uppercase font-bold text-red-700 mb-1">
                        <Youtube className="w-4 h-4" />
                        <span>YouTube Video URL (Optional — Auto-Embeds Player)</span>
                      </label>
                      <input
                        type="url"
                        value={newsYoutubeUrl}
                        onChange={(e) => setNewsYoutubeUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                        className="w-full px-3 py-2 bg-white border border-stone-300 text-xs font-mono-meta"
                      />
                      {previewYoutubeId && (
                        <div className="mt-2 border border-stone-300 bg-black aspect-video max-h-36 overflow-hidden">
                          <iframe
                            src={`https://www.youtube.com/embed/${previewYoutubeId}`}
                            title="YouTube Preview"
                            className="w-full h-full"
                            allowFullScreen
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-mono-meta uppercase font-bold text-stone-700 mb-1">
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>External Source URL Link (Optional)</span>
                      </label>
                      <input
                        type="url"
                        value={newsUrl}
                        onChange={(e) => setNewsUrl(e.target.value)}
                        placeholder="https://www.bbc.com/news/... (Optional)"
                        className="w-full px-3 py-2 bg-white border border-stone-300 text-xs font-mono-meta"
                      />

                      <div className="mt-3">
                        <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700 mb-1">
                          Syndicated Desk / Channel Source
                        </label>
                        <select
                          value={selectedChannel}
                          onChange={(e) => setSelectedChannel(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 text-xs font-mono-meta"
                        >
                          {channels.map((chan) => (
                            <option key={chan._id || chan.name} value={chan.name}>{chan.name}</option>
                          ))}
                          <option value="News for All">News for All</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Row 5: Image Upload / URL */}
                  <div className="bg-stone-50 p-4 border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono-meta uppercase font-bold text-stone-800">
                        Feature Photograph / Thumbnail Image
                      </label>
                      <div className="flex items-center gap-1 bg-white p-1 border border-stone-300 text-[11px] font-mono-meta">
                        <button
                          type="button"
                          onClick={() => setNewsImageMode('upload')}
                          className={`px-2.5 py-1 ${newsImageMode === 'upload' ? 'bg-stone-900 text-white font-bold' : 'text-stone-600'}`}
                        >
                          Upload File
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewsImageMode('url')}
                          className={`px-2.5 py-1 ${newsImageMode === 'url' ? 'bg-stone-900 text-white font-bold' : 'text-stone-600'}`}
                        >
                          Image URL
                        </button>
                      </div>
                    </div>

                    {newsImageMode === 'upload' ? (
                      <div>
                        <input
                          ref={newsFileRef}
                          type="file"
                          accept="image/*"
                          onChange={handleNewsFileUpload}
                          className="hidden"
                          id="studioNewsImageUpload"
                        />
                        <label
                          htmlFor="studioNewsImageUpload"
                          className="border-2 border-dashed border-stone-300 hover:border-stone-900 bg-white p-4 flex flex-col items-center justify-center cursor-pointer text-center"
                        >
                          <Upload className="w-5 h-5 text-stone-700 mb-1" />
                          <span className="text-xs font-mono-meta font-bold">
                            {newsImageName || 'Click to Upload Photograph from Computer/Phone'}
                          </span>
                        </label>
                      </div>
                    ) : (
                      <input
                        type="url"
                        value={newsImage}
                        onChange={(e) => setNewsImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 bg-white border border-stone-300 text-xs font-mono-meta"
                      />
                    )}

                    {newsImage && (
                      <div className="flex items-center justify-between p-2 bg-white border border-stone-200">
                        <div className="flex items-center gap-3">
                          <img src={newsImage} alt="Preview" className="w-16 h-12 object-cover border border-stone-300" />
                          <span className="text-xs font-mono-meta text-emerald-700 font-bold">✓ Image Ready</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setNewsImage('');
                            setNewsImageName('');
                          }}
                          className="text-xs text-red-600 font-mono-meta underline"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Row 6: Tags, Per-Article SEO & Pin to Front Page */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700 mb-1">
                        Tags (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={newsTags}
                        onChange={(e) => setNewsTags(e.target.value)}
                        placeholder="Journalism, World, Culture"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 text-xs font-mono-meta"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700 mb-1">
                        SEO Meta Title (Optional)
                      </label>
                      <input
                        type="text"
                        value={newsSeoTitle}
                        onChange={(e) => setNewsSeoTitle(e.target.value)}
                        placeholder="Custom search engine title..."
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700 mb-1">
                        SEO Meta Description (Optional)
                      </label>
                      <input
                        type="text"
                        value={newsSeoDescription}
                        onChange={(e) => setNewsSeoDescription(e.target.value)}
                        placeholder="Custom description for Google/Social..."
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-stone-200">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-mono-meta uppercase font-bold">
                      <input
                        type="checkbox"
                        checked={newsFeatured}
                        onChange={(e) => setNewsFeatured(e.target.checked)}
                        className="w-4 h-4 accent-stone-900"
                      />
                      <span>Feature on Front Page Lead Section</span>
                    </label>

                    <button
                      type="submit"
                      className="px-8 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-mono-meta uppercase tracking-widest font-bold flex items-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>{editingId ? 'Save Changes to Story' : 'Publish Story to Chronicle'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: MANAGE ALL POSTS (EDIT / DELETE) */}
              {activeTab === 'manage' && (
                <div className="bg-white p-6 border border-stone-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <h4 className="font-serif-display text-xl font-bold">
                      Manage All Published Dispatches ({news.length})
                    </h4>
                    <button
                      onClick={() => {
                        setEditingArticle(null);
                        resetPostForm();
                        setActiveTab('posts');
                      }}
                      className="px-3 py-1.5 bg-stone-900 text-white text-xs font-mono-meta uppercase"
                    >
                      + Create New Story
                    </button>
                  </div>

                  <div className="divide-y divide-stone-200">
                    {news.map((item) => (
                      <div key={item._id} className="py-3.5 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <img
                            src={item.image}
                            alt=""
                            className="w-16 h-12 object-cover border border-stone-300 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 text-[10px] font-mono-meta uppercase text-stone-500">
                              <span className="font-bold text-red-700">{item.postType || 'Article'}</span>
                              <span>•</span>
                              <span>{item.category}</span>
                              <span>•</span>
                              <span>{item.publishedAt || item.publishDate}</span>
                              {item.youtubeUrl && <span className="text-red-600 font-bold">• 🎥 YouTube</span>}
                              {item.isFeatured && <span className="bg-amber-100 text-amber-900 px-1.5 font-bold">★ Featured</span>}
                            </div>
                            <h5 className="font-serif-display font-bold text-base truncate text-stone-900">
                              {item.title}
                            </h5>
                            <p className="text-xs text-stone-500 truncate">
                              By {item.author || 'Editorial Desk'} — {item.channelName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setEditingArticle(item);
                              setActiveTab('posts');
                            }}
                            className="px-3 py-1.5 border border-stone-300 hover:border-stone-900 text-xs font-mono-meta uppercase flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Permanently delete "${item.title}"?`)) {
                                deleteNewsPost(item._id);
                              }
                            }}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-mono-meta uppercase flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: SITE BRANDING, LOGO, CATEGORIES & POST FORMATS */}
              {activeTab === 'branding' && (
                <form onSubmit={handleSaveSettings} className="bg-white p-6 border border-stone-200 space-y-6">
                  <h4 className="font-serif-display text-xl font-bold border-b border-stone-200 pb-3">
                    Categories, Post Formats, Website Name & Masthead Logo
                  </h4>

                  {/* Category Manager */}
                  <div className="bg-stone-50 p-4 border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-mono-meta uppercase font-bold text-stone-800">
                        1. Manage Navigation Categories (Add / Delete)
                      </label>
                      <span className="text-[11px] font-mono-meta text-stone-500">
                        {categoriesList.length} Categories Active
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categoriesList.map((cat) => (
                        <span
                          key={cat}
                          className="px-3 py-1 bg-white border border-stone-300 text-xs font-mono-meta uppercase flex items-center gap-2"
                        >
                          <span>{cat}</span>
                          {cat !== 'All' && (
                            <button
                              type="button"
                              onClick={() => removeCategoryFromList(cat)}
                              className="text-red-600 hover:text-red-800 font-bold"
                              title={`Remove ${cat}`}
                            >
                              ×
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCategoryInput}
                        onChange={(e) => setNewCategoryInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addCategoryToList();
                          }
                        }}
                        placeholder="Add new category (e.g. Science, Cinema, Philosophy, Business)..."
                        className="flex-1 px-3 py-2 bg-white border border-stone-300 text-xs font-mono-meta"
                      />
                      <button
                        type="button"
                        onClick={addCategoryToList}
                        className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-mono-meta uppercase font-bold"
                      >
                        + Add Category
                      </button>
                    </div>
                  </div>

                  {/* Post Format Manager */}
                  <div className="bg-stone-50 p-4 border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-mono-meta uppercase font-bold text-stone-800">
                        2. Manage Post Formats (Add / Delete — e.g. News, Story, Article, Video, Podcast, Interview)
                      </label>
                      <span className="text-[11px] font-mono-meta text-stone-500">
                        {postFormatsList.length} Formats Active
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {postFormatsList.map((fmt) => (
                        <span
                          key={fmt}
                          className="px-3 py-1 bg-white border border-stone-300 text-xs font-mono-meta uppercase flex items-center gap-2"
                        >
                          <span>{fmt}</span>
                          {postFormatsList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePostFormatFromList(fmt)}
                              className="text-red-600 hover:text-red-800 font-bold"
                              title={`Remove ${fmt}`}
                            >
                              ×
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newPostFormatInput}
                        onChange={(e) => setNewPostFormatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addPostFormatToList();
                          }
                        }}
                        placeholder="Add new Post Format (e.g. Documentary, Column, Breaking, Podcast, Review)..."
                        className="flex-1 px-3 py-2 bg-white border border-stone-300 text-xs font-mono-meta"
                      />
                      <button
                        type="button"
                        onClick={addPostFormatToList}
                        className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-mono-meta uppercase font-bold"
                      >
                        + Add Post Format
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-200">
                    <div>
                      <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700 mb-1">
                        Website Name / Masthead Title
                      </label>
                      <input
                        type="text"
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                        placeholder="News for All"
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 text-base font-serif-display font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700 mb-1">
                        Edition Volume Line
                      </label>
                      <input
                        type="text"
                        value={siteEdition}
                        onChange={(e) => setSiteEdition(e.target.value)}
                        placeholder="VOL. XCIV • INTERNATIONAL EDITION"
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 text-xs font-mono-meta"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700 mb-1">
                      Masthead Tagline / Subtitle
                    </label>
                    <input
                      type="text"
                      value={siteTagline}
                      onChange={(e) => setSiteTagline(e.target.value)}
                      placeholder="THE GLOBAL CHRONICLE • INDEPENDENT STORIES, NEWS & EDITORIAL ARTICLES"
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 text-xs font-mono-meta"
                    />
                  </div>

                  {/* Website Logo Upload or URL */}
                  <div className="bg-stone-50 p-4 border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono-meta uppercase font-bold text-stone-800">
                        Website Masthead Logo (Optional — Displays above Site Name)
                      </label>
                      <div className="flex items-center gap-1 bg-white p-1 border border-stone-300 text-[11px] font-mono-meta">
                        <button
                          type="button"
                          onClick={() => setLogoMode('upload')}
                          className={`px-2.5 py-1 ${logoMode === 'upload' ? 'bg-stone-900 text-white font-bold' : 'text-stone-600'}`}
                        >
                          Upload Logo
                        </button>
                        <button
                          type="button"
                          onClick={() => setLogoMode('url')}
                          className={`px-2.5 py-1 ${logoMode === 'url' ? 'bg-stone-900 text-white font-bold' : 'text-stone-600'}`}
                        >
                          Logo URL
                        </button>
                      </div>
                    </div>

                    {logoMode === 'upload' ? (
                      <div>
                        <input
                          ref={logoFileRef}
                          type="file"
                          accept="image/*"
                          onChange={handleSiteLogoUpload}
                          className="hidden"
                          id="siteLogoInput"
                        />
                        <label
                          htmlFor="siteLogoInput"
                          className="border-2 border-dashed border-stone-300 hover:border-stone-900 bg-white p-4 flex flex-col items-center justify-center cursor-pointer text-center"
                        >
                          <Upload className="w-5 h-5 text-stone-700 mb-1" />
                          <span className="text-xs font-mono-meta font-bold">Click to Upload Website Logo Image</span>
                        </label>
                      </div>
                    ) : (
                      <input
                        type="url"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 bg-white border border-stone-300 text-xs font-mono-meta"
                      />
                    )}

                    {logoUrl && (
                      <div className="flex items-center justify-between p-2 bg-white border border-stone-200">
                        <img src={logoUrl} alt="Site Logo" className="h-12 object-contain" />
                        <button
                          type="button"
                          onClick={() => setLogoUrl('')}
                          className="text-xs text-red-600 font-mono-meta underline"
                        >
                          Remove Logo
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700 mb-1">
                      Footer Copyright & Colophon Text
                    </label>
                    <input
                      type="text"
                      value={footerText}
                      onChange={(e) => setFooterText(e.target.value)}
                      className="w-full px-4 py-2 bg-stone-50 border border-stone-300 text-xs font-mono-meta"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-mono-meta uppercase tracking-widest font-bold flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Branding, Categories & Post Formats</span>
                  </button>
                </form>
              )}

              {/* TAB 4: SEO, META DESCRIPTION & SOCIAL PROFILES */}
              {activeTab === 'seo' && (
                <form onSubmit={handleSaveSettings} className="bg-white p-6 border border-stone-200 space-y-6">
                  <h4 className="font-serif-display text-xl font-bold border-b border-stone-200 pb-3">
                    Search Engine Optimization (SEO), Meta Tags & Social Links
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700 mb-1">
                        Default Meta Title (Browser Title & Google Search Headline)
                      </label>
                      <input
                        type="text"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700 mb-1">
                        Meta Description (Search Engine Summary & OpenGraph Description)
                      </label>
                      <textarea
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 text-xs h-24"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700 mb-1">
                        SEO Meta Keywords (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={metaKeywords}
                        onChange={(e) => setMetaKeywords(e.target.value)}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 text-xs font-mono-meta"
                      />
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="pt-4 border-t border-stone-200 space-y-4">
                    <h5 className="font-mono-meta text-xs uppercase tracking-widest font-bold text-stone-800">
                      Official Social Media Links (Displayed in Header & Footer)
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {['facebook', 'instagram', 'linkedin', 'medium', 'youtube', 'twitter'].map((net) => (
                        <div key={net}>
                          <label className="block text-[11px] font-mono-meta uppercase font-bold text-stone-600 mb-1">
                            {net} URL
                          </label>
                          <input
                            type="url"
                            value={socialLinks[net] || ''}
                            onChange={(e) => setSocialLinks({ ...socialLinks, [net]: e.target.value })}
                            placeholder={`https://${net}.com/...`}
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 text-xs font-mono-meta"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-mono-meta uppercase tracking-widest font-bold flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save SEO & Social Settings</span>
                  </button>
                </form>
              )}

              {/* TAB 5: VINTAGE COLOR & THEME DESIGNER */}
              {activeTab === 'colors' && (
                <form onSubmit={handleSaveSettings} className="bg-white p-6 border border-stone-200 space-y-6">
                  <h4 className="font-serif-display text-xl font-bold border-b border-stone-200 pb-3">
                    Modern-Vintage Color Palette & Theme Designer
                  </h4>

                  <div>
                    <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700 mb-3">
                      1-Click Curated Editorial Presets
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {THEME_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setThemeColors({ ...preset, presetName: preset.name })}
                          className={`p-3 border-2 text-left transition-all ${
                            themeColors.presetName === preset.name ? 'border-stone-900 ring-2 ring-stone-900/20' : 'border-stone-200 hover:border-stone-400'
                          }`}
                          style={{ backgroundColor: preset.bgColor, color: preset.textColor }}
                        >
                          <div className="flex items-center gap-1.5 mb-2">
                            <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: preset.bgColor }}></span>
                            <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: preset.accentColor }}></span>
                            <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: preset.textColor }}></span>
                          </div>
                          <p className="font-serif-display font-bold text-xs">{preset.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Hex Color Pickers */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-200">
                    <div>
                      <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700 mb-1">
                        Paper Background Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={themeColors.bgColor || '#FBF8F3'}
                          onChange={(e) => setThemeColors({ ...themeColors, bgColor: e.target.value, presetName: 'Custom' })}
                          className="w-10 h-10 border border-stone-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={themeColors.bgColor || '#FBF8F3'}
                          onChange={(e) => setThemeColors({ ...themeColors, bgColor: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-300 text-xs font-mono-meta"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700 mb-1">
                        Card Surface Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={themeColors.cardBg || '#FFFDF9'}
                          onChange={(e) => setThemeColors({ ...themeColors, cardBg: e.target.value, presetName: 'Custom' })}
                          className="w-10 h-10 border border-stone-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={themeColors.cardBg || '#FFFDF9'}
                          onChange={(e) => setThemeColors({ ...themeColors, cardBg: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-300 text-xs font-mono-meta"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700 mb-1">
                        Primary Ink / Text Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={themeColors.textColor || '#181615'}
                          onChange={(e) => setThemeColors({ ...themeColors, textColor: e.target.value, presetName: 'Custom' })}
                          className="w-10 h-10 border border-stone-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={themeColors.textColor || '#181615'}
                          onChange={(e) => setThemeColors({ ...themeColors, textColor: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-300 text-xs font-mono-meta"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700 mb-1">
                        Editorial Accent Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={themeColors.accentColor || '#9E2A2B'}
                          onChange={(e) => setThemeColors({ ...themeColors, accentColor: e.target.value, presetName: 'Custom' })}
                          className="w-10 h-10 border border-stone-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={themeColors.accentColor || '#9E2A2B'}
                          onChange={(e) => setThemeColors({ ...themeColors, accentColor: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-300 text-xs font-mono-meta"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700 mb-1">
                        Secondary Muted Ink
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={themeColors.secondaryText || '#5C554E'}
                          onChange={(e) => setThemeColors({ ...themeColors, secondaryText: e.target.value, presetName: 'Custom' })}
                          className="w-10 h-10 border border-stone-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={themeColors.secondaryText || '#5C554E'}
                          onChange={(e) => setThemeColors({ ...themeColors, secondaryText: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-300 text-xs font-mono-meta"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700 mb-1">
                        Rule / Border Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={themeColors.borderColor || '#D8CFC2'}
                          onChange={(e) => setThemeColors({ ...themeColors, borderColor: e.target.value, presetName: 'Custom' })}
                          className="w-10 h-10 border border-stone-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={themeColors.borderColor || '#D8CFC2'}
                          onChange={(e) => setThemeColors({ ...themeColors, borderColor: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-300 text-xs font-mono-meta"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-mono-meta uppercase tracking-widest font-bold flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Apply & Save Color Theme</span>
                  </button>
                </form>
              )}

              {/* TAB 6: MANAGE SYNDICATED DESKS & CHANNELS */}
              {activeTab === 'channels' && (
                <div className="space-y-6">
                  <form onSubmit={handleChannelSubmit} className="bg-white p-6 border border-stone-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                      <h4 className="font-serif-display text-xl font-bold">
                        {editingChannelId ? 'Edit Syndicated Desk / Channel' : 'Add Syndicated Desk / News Channel'}
                      </h4>
                      {editingChannelId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingChannelId(null);
                            setChannelName('');
                            setChannelLogo('');
                            setChannelUrl('');
                            setChannelDesc('');
                          }}
                          className="px-3 py-1 bg-stone-200 text-xs font-mono-meta uppercase"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700 mb-1">
                          Desk / Channel Name *
                        </label>
                        <input
                          type="text"
                          value={channelName}
                          onChange={(e) => setChannelName(e.target.value)}
                          placeholder="e.g. REUTERS, BBC NEWS, THE GUARDIAN"
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-300 text-xs font-mono-meta"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono-meta uppercase font-bold text-stone-700 mb-1">
                          Official Website URL *
                        </label>
                        <input
                          type="url"
                          value={channelUrl}
                          onChange={(e) => setChannelUrl(e.target.value)}
                          placeholder="https://www.reuters.com"
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-300 text-xs font-mono-meta"
                          required
                        />
                      </div>
                    </div>

                    {/* Channel Logo Upload or URL */}
                    <div className="bg-stone-50 p-4 border border-stone-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono-meta uppercase font-bold text-stone-800">
                          Channel Logo Image
                        </label>
                        <div className="flex items-center gap-1 bg-white p-1 border border-stone-300 text-[11px] font-mono-meta">
                          <button
                            type="button"
                            onClick={() => setChannelLogoMode('upload')}
                            className={`px-2 py-0.5 ${channelLogoMode === 'upload' ? 'bg-stone-900 text-white' : ''}`}
                          >
                            Upload File
                          </button>
                          <button
                            type="button"
                            onClick={() => setChannelLogoMode('url')}
                            className={`px-2 py-0.5 ${channelLogoMode === 'url' ? 'bg-stone-900 text-white' : ''}`}
                          >
                            Logo URL
                          </button>
                        </div>
                      </div>

                      {channelLogoMode === 'upload' ? (
                        <div>
                          <input
                            ref={channelFileRef}
                            type="file"
                            accept="image/*"
                            onChange={handleChannelLogoUpload}
                            className="hidden"
                            id="chanLogoUpload"
                          />
                          <label
                            htmlFor="chanLogoUpload"
                            className="border-2 border-dashed border-stone-300 bg-white p-3 flex flex-col items-center justify-center cursor-pointer"
                          >
                            <Upload className="w-4 h-4 mb-1" />
                            <span className="text-xs font-mono-meta">{channelLogoName || 'Select Channel Logo Image'}</span>
                          </label>
                        </div>
                      ) : (
                        <input
                          type="url"
                          value={channelLogo}
                          onChange={(e) => setChannelLogo(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 bg-white border border-stone-300 text-xs font-mono-meta"
                        />
                      )}
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-stone-900 text-white text-xs font-mono-meta uppercase tracking-widest font-bold"
                    >
                      {editingChannelId ? 'Update Channel' : '+ Add Desk / Channel'}
                    </button>
                  </form>

                  {/* Existing Channels List */}
                  <div className="bg-white p-6 border border-stone-200">
                    <h5 className="font-mono-meta text-xs uppercase tracking-widest font-bold mb-4">
                      Registered Desks & Channels ({channels.length})
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {channels.map((c) => (
                        <div key={c._id} className="p-3 border border-stone-200 flex items-center justify-between">
                          <div className="flex items-center gap-2.5 truncate">
                            {c.logo && <img src={c.logo} alt="" className="w-7 h-7 object-contain" />}
                            <div className="truncate">
                              <p className="font-mono-meta text-xs font-bold uppercase">{c.name}</p>
                              <p className="text-[10px] text-stone-400 truncate">{c.url}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingChannelId(c._id);
                                setChannelName(c.name);
                                setChannelLogo(c.logo || '');
                                setChannelUrl(c.url || '');
                                setChannelDesc(c.description || '');
                              }}
                              className="p-1.5 border border-stone-300 hover:border-stone-900"
                              title="Edit Channel"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete channel "${c.name}"?`)) {
                                  deleteChannel(c._id);
                                }
                              }}
                              className="p-1.5 border border-red-200 text-red-600 hover:bg-red-50"
                              title="Delete Channel"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
