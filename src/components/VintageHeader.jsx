import React, { useState } from 'react';
import { 
  Search, 
  Feather, 
  Bookmark, 
  ShieldCheck, 
  PlusCircle, 
  Palette, 
  Sparkles, 
  LogOut, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Youtube,
  Database,
  X
} from 'lucide-react';
import { useNews } from '../context/NewsContext';

export default function VintageHeader() {
  const {
    siteSettings,
    dbStatus,
    activeTab,
    setActiveTab,
    activeCategory,
    setActiveCategory,
    activePostType,
    setActivePostType,
    searchQuery,
    setSearchQuery,
    savedArticles,
    isAdminLoggedIn,
    setIsAdminOpen,
    setAdminInitialTab,
    setEditingArticle,
    logoutAdmin,
    twoLatestPerChannel,
    setTwoLatestPerChannel
  } = useNews();

  const [searchOpen, setSearchOpen] = useState(false);

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const categories = siteSettings?.categories?.length > 0
    ? siteSettings.categories
    : ['All', 'News', 'Stories', 'Articles', 'World', 'Politics', 'Culture', 'Technology', 'Opinion', 'Video'];

  const customPostFormats = siteSettings?.postFormats?.length > 0
    ? siteSettings.postFormats
    : ['News', 'Story', 'Article', 'Editorial', 'Video'];

  const postTypes = ['All', ...customPostFormats.filter(f => f !== 'All')];

  return (
    <header className="w-full border-b vintage-border transition-colors" style={{ backgroundColor: 'var(--bg-color)' }}>
      {/* Top Admin Command Ribbon (Visible ONLY when Admin is Logged In) */}
      {isAdminLoggedIn && (
        <div 
          className="w-full py-2 px-4 sm:px-8 border-b vintage-border flex flex-wrap items-center justify-between gap-3 text-xs"
          style={{ backgroundColor: 'var(--text-color)', color: 'var(--bg-color)' }}
        >
          <div className="flex flex-wrap items-center gap-3 font-mono-meta">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold uppercase tracking-wider">Editor-in-Chief Mode</span>
            </div>

            <span className="opacity-30">|</span>

            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/10 border border-white/20 text-[10px]">
              <Database className="w-3 h-3 text-emerald-400" />
              <span>DB: {dbStatus?.engine || 'MySQL 8.0 Realtime'}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setEditingArticle(null);
                setAdminInitialTab('posts');
                setIsAdminOpen(true);
              }}
              className="px-3 py-1 rounded-none font-mono-meta text-[11px] uppercase tracking-wider font-bold flex items-center gap-1.5 transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--accent-color)', color: '#FFFFFF' }}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ New Story / Post</span>
            </button>

            <button
              onClick={() => {
                setAdminInitialTab('manage');
                setIsAdminOpen(true);
              }}
              className="px-2.5 py-1 border border-white/25 hover:bg-white/10 font-mono-meta text-[11px] uppercase tracking-wider transition-colors"
            >
              Manage Posts
            </button>

            <button
              onClick={() => {
                setAdminInitialTab('branding');
                setIsAdminOpen(true);
              }}
              className="px-2.5 py-1 border border-white/25 hover:bg-white/10 font-mono-meta text-[11px] uppercase tracking-wider flex items-center gap-1 transition-colors"
            >
              <Palette className="w-3 h-3" />
              <span>Categories, Formats & Branding</span>
            </button>

            <button
              onClick={() => setTwoLatestPerChannel(!twoLatestPerChannel)}
              className={`px-2.5 py-1 border font-mono-meta text-[11px] uppercase tracking-wider flex items-center gap-1 transition-colors ${
                twoLatestPerChannel ? 'bg-amber-500 text-black border-amber-500 font-bold' : 'border-white/25 hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>2-Latest Rule: {twoLatestPerChannel ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="px-2.5 py-1 bg-red-600/80 hover:bg-red-600 text-white font-mono-meta text-[11px] uppercase tracking-wider flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>Exit Admin</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Edition Metadata Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 border-b vintage-border flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-meta uppercase tracking-widest" style={{ color: 'var(--secondary-text)' }}>
        <div className="flex items-center gap-3">
          <span>{siteSettings.siteEdition || 'VOL. XCIV • INTERNATIONAL EDITION'}</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">{todayFormatted}</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Social Follow Links */}
          <div className="hidden sm:flex items-center gap-2.5 border-r vintage-border pr-4">
            {siteSettings.socialLinks?.facebook && (
              <a href={siteSettings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" title="Facebook" className="hover:opacity-70 transition-opacity">
                <Facebook className="w-3.5 h-3.5" />
              </a>
            )}
            {siteSettings.socialLinks?.instagram && (
              <a href={siteSettings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" title="Instagram" className="hover:opacity-70 transition-opacity">
                <Instagram className="w-3.5 h-3.5" />
              </a>
            )}
            {siteSettings.socialLinks?.linkedin && (
              <a href={siteSettings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="hover:opacity-70 transition-opacity">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            )}
            {siteSettings.socialLinks?.medium && (
              <a href={siteSettings.socialLinks.medium} target="_blank" rel="noopener noreferrer" title="Medium" className="font-serif font-bold text-xs hover:opacity-70 transition-opacity">
                M
              </a>
            )}
            {siteSettings.socialLinks?.youtube && (
              <a href={siteSettings.socialLinks.youtube} target="_blank" rel="noopener noreferrer" title="YouTube" className="hover:opacity-70 transition-opacity">
                <Youtube className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Saved Reading List Toggle */}
          <button
            onClick={() => setActiveTab(activeTab === 'saved' ? 'home' : 'saved')}
            className="flex items-center gap-1 hover:opacity-80 transition-opacity font-semibold"
            style={{ color: activeTab === 'saved' ? 'var(--accent-color)' : 'var(--text-color)' }}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Reading List ({savedArticles.length})</span>
          </button>

          {/* Subtle Editor / Admin Login Trigger */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center gap-1 hover:opacity-80 transition-opacity font-semibold"
            style={{ color: isAdminLoggedIn ? 'var(--accent-color)' : 'var(--secondary-text)' }}
            title={isAdminLoggedIn ? 'Open Editorial Studio' : 'Editor Login'}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isAdminLoggedIn ? 'Studio' : 'Editor'}</span>
          </button>
        </div>
      </div>

      {/* Main Broadsheet Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10 text-center relative">
        <div 
          onClick={() => {
            setActiveTab('home');
            setActiveCategory('All');
            setActivePostType('All');
          }}
          className="cursor-pointer inline-flex flex-col items-center group"
        >
          {siteSettings.logoUrl && siteSettings.logoUrl.trim() !== '' ? (
            <img
              src={siteSettings.logoUrl}
              alt={siteSettings.siteName}
              className="h-14 sm:h-20 object-contain mb-3 transition-transform group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="h-px w-8 sm:w-16" style={{ backgroundColor: 'var(--accent-color)' }}></span>
              <Feather className="w-5 h-5" style={{ color: 'var(--accent-color)' }} />
              <span className="h-px w-8 sm:w-16" style={{ backgroundColor: 'var(--accent-color)' }}></span>
            </div>
          )}

          <h1 
            className="font-serif-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none"
            style={{ color: 'var(--text-color)' }}
          >
            {siteSettings.siteName || 'News for All'}
          </h1>

          <p 
            className="mt-3 font-mono-meta text-[11px] sm:text-xs uppercase tracking-[0.22em] max-w-2xl mx-auto"
            style={{ color: 'var(--secondary-text)' }}
          >
            {siteSettings.siteTagline || 'THE GLOBAL CHRONICLE • INDEPENDENT STORIES, NEWS & EDITORIAL ARTICLES'}
          </p>
        </div>
      </div>

      {/* Double Rule Navigation & Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="vintage-double-rule py-2.5 flex flex-wrap items-center justify-between gap-4">
          {/* Categories Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto custom-scrollbar py-0.5 flex-1">
            {categories.map((cat) => {
              const isSelected = activeCategory.toLowerCase() === cat.toLowerCase() && activeTab === 'home';
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveTab('home');
                    setActiveCategory(cat);
                  }}
                  className={`px-3 py-1.5 text-xs uppercase tracking-widest font-mono-meta transition-all whitespace-nowrap ${
                    isSelected ? 'font-bold' : 'hover:opacity-75'
                  }`}
                  style={{
                    backgroundColor: isSelected ? 'var(--accent-color)' : 'transparent',
                    color: isSelected ? '#FFFFFF' : 'var(--text-color)'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </nav>

          {/* Post Type Pill Filter & Search Bar */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Post Format Selector */}
            <div className="hidden lg:flex items-center border vintage-border p-0.5 overflow-x-auto max-w-md" style={{ backgroundColor: 'var(--card-bg)' }}>
              {postTypes.map((type) => {
                const active = activePostType === type;
                return (
                  <button
                    key={type}
                    onClick={() => {
                      setActiveTab('home');
                      setActivePostType(type);
                    }}
                    className="px-2.5 py-1 text-[11px] font-mono-meta uppercase tracking-wider transition-all whitespace-nowrap"
                    style={{
                      backgroundColor: active ? 'var(--text-color)' : 'transparent',
                      color: active ? 'var(--bg-color)' : 'var(--secondary-text)'
                    }}
                  >
                    {type === 'All' ? 'All Formats' : type}
                  </button>
                );
              })}
            </div>

            {/* Expandable Search Input */}
            {searchOpen || searchQuery ? (
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 absolute left-3" style={{ color: 'var(--secondary-text)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stories, authors, topics..."
                  autoFocus
                  className="pl-8 pr-7 py-1 text-xs border vintage-border focus:outline-none w-48 sm:w-64 font-mono-meta"
                  style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-color)' }}
                />
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchOpen(false);
                  }}
                  className="absolute right-2 hover:opacity-75"
                  style={{ color: 'var(--secondary-text)' }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-1.5 border vintage-border hover:opacity-80 transition-opacity flex items-center gap-1.5 text-xs font-mono-meta px-3"
                style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-color)' }}
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Search</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
