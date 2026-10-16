import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube, Twitter, Feather, ShieldCheck } from 'lucide-react';
import { useNews } from '../context/NewsContext';

export default function VintageFooter({ setActiveView }) {
  const {
    siteSettings,
    activeCategory,
    setActiveCategory,
    isAdminLoggedIn,
    setIsAdminOpen
  } = useNews();

  const categories = siteSettings?.categories || ['All', 'News', 'Stories', 'Articles', 'World', 'Politics', 'Culture', 'Technology'];

  return (
    <footer className="mt-20 border-t-2" style={{ borderColor: 'var(--text-color)', backgroundColor: 'var(--card-bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b vintage-border">
          {/* Brand & Mission */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              {siteSettings.logoUrl ? (
                <img src={siteSettings.logoUrl} alt={siteSettings.siteName} className="h-9 object-contain" />
              ) : (
                <Feather className="w-6 h-6" style={{ color: 'var(--accent-color)' }} />
              )}
              <h3 className="font-serif-display text-2xl font-black tracking-tight">
                {siteSettings.siteName || 'News for All'}
              </h3>
            </div>
            <p className="font-editorial text-sm leading-relaxed max-w-md" style={{ color: 'var(--secondary-text)' }}>
              {siteSettings.metaDescription}
            </p>
            <p className="font-mono-meta text-[11px] uppercase tracking-widest" style={{ color: 'var(--accent-color)' }}>
              {siteSettings.siteEdition}
            </p>
          </div>

          {/* Sections / Categories */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-mono-meta text-xs uppercase tracking-widest font-bold">
              Editorial Desks & Categories
            </h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveView('home');
                    setActiveCategory(cat);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-2.5 py-1 text-xs font-mono-meta uppercase border vintage-border hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: activeCategory === cat ? 'var(--accent-color)' : 'var(--bg-color)',
                    color: activeCategory === cat ? '#FFFFFF' : 'var(--text-color)'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Social Channels & Admin Studio Link */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-mono-meta text-xs uppercase tracking-widest font-bold">
              Follow & Connect
            </h4>
            <div className="flex flex-wrap items-center gap-2.5">
              {siteSettings.socialLinks?.facebook && (
                <a
                  href={siteSettings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border vintage-border hover:opacity-75 transition-opacity"
                  style={{ backgroundColor: 'var(--bg-color)' }}
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {siteSettings.socialLinks?.instagram && (
                <a
                  href={siteSettings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border vintage-border hover:opacity-75 transition-opacity"
                  style={{ backgroundColor: 'var(--bg-color)' }}
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {siteSettings.socialLinks?.linkedin && (
                <a
                  href={siteSettings.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border vintage-border hover:opacity-75 transition-opacity"
                  style={{ backgroundColor: 'var(--bg-color)' }}
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {siteSettings.socialLinks?.medium && (
                <a
                  href={siteSettings.socialLinks.medium}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 border vintage-border hover:opacity-75 transition-opacity font-serif font-black text-sm"
                  style={{ backgroundColor: 'var(--bg-color)' }}
                  title="Medium"
                >
                  M
                </a>
              )}
              {siteSettings.socialLinks?.youtube && (
                <a
                  href={siteSettings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border vintage-border hover:opacity-75 transition-opacity"
                  style={{ backgroundColor: 'var(--bg-color)' }}
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {siteSettings.socialLinks?.twitter && (
                <a
                  href={siteSettings.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border vintage-border hover:opacity-75 transition-opacity"
                  style={{ backgroundColor: 'var(--bg-color)' }}
                  title="X / Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="px-3.5 py-2 border vintage-border text-xs font-mono-meta uppercase tracking-wider flex items-center gap-1.5 hover:opacity-80"
                style={{ backgroundColor: 'var(--bg-color)' }}
              >
                <ShieldCheck className="w-3.5 h-3.5" style={{ color: 'var(--accent-color)' }} />
                <span>{isAdminLoggedIn ? 'Open Editorial Studio' : 'Admin / Editor Login'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Colophon */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs font-mono-meta" style={{ color: 'var(--secondary-text)' }}>
          <p>{siteSettings.footerText || `© 2026 ${siteSettings.siteName}. All Rights Reserved.`}</p>
          <p>Modern-Vintage Editorial Publishing Platform</p>
        </div>
      </div>
    </footer>
  );
}
