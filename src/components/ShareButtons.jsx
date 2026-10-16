import React, { useState } from 'react';
import { 
  Share2, 
  Facebook, 
  Linkedin, 
  Instagram, 
  BookOpen, 
  Link as LinkIcon, 
  Check,
  Twitter,
  MessageCircle
} from 'lucide-react';

export default function ShareButtons({ article, compact = false }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = article?.url && article.url.trim() !== ''
    ? article.url
    : window.location.origin + `/?article=${article?._id || ''}`;
  const shareTitle = `${article?.title || 'News for All'} — ${article?.subtitle || ''}`;

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${article?.title}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const openShareWindow = (e, url) => {
    e.stopPropagation();
    window.open(url, '_blank', 'width=650,height=500,noopener,noreferrer');
  };

  const platforms = [
    {
      name: 'Facebook',
      icon: Facebook,
      onClick: (e) => openShareWindow(e, `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareTitle)}`),
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      onClick: (e) => openShareWindow(e, `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`),
    },
    {
      name: 'Medium',
      label: 'M',
      onClick: (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(`${article?.title}\n\n${article?.description || ''}\n\nSource: ${shareUrl}`);
        window.open('https://medium.com/new-story', '_blank', 'noopener,noreferrer');
      },
    },
    {
      name: 'Instagram',
      icon: Instagram,
      onClick: (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(`${article?.title} — Read more at ${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
      },
    },
    {
      name: 'X / Twitter',
      icon: Twitter,
      onClick: (e) => openShareWindow(e, `https://twitter.com/intent/tweet?text=${encodeURIComponent(article?.title || '')}&url=${encodeURIComponent(shareUrl)}`),
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      onClick: (e) => openShareWindow(e, `https://api.whatsapp.com/send?text=${encodeURIComponent((article?.title || '') + ' ' + shareUrl)}`),
    },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        {platforms.slice(0, 4).map((p) => {
          const Icon = p.icon;
          return (
            <button
              key={p.name}
              onClick={p.onClick}
              title={`Share on ${p.name}`}
              className="w-7 h-7 rounded-full border vintage-border flex items-center justify-center hover:opacity-80 transition-all text-xs font-serif font-bold"
              style={{ color: 'var(--secondary-text)', backgroundColor: 'var(--bg-color)' }}
            >
              {Icon ? <Icon className="w-3.5 h-3.5" /> : <span>{p.label}</span>}
            </button>
          );
        })}
        <button
          onClick={handleCopy}
          title="Copy Share Link"
          className="w-7 h-7 rounded-full border vintage-border flex items-center justify-center hover:opacity-80 transition-all"
          style={{ color: copied ? 'var(--accent-color)' : 'var(--secondary-text)', backgroundColor: 'var(--bg-color)' }}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <LinkIcon className="w-3.5 h-3.5" />}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
      <span className="font-mono-meta text-[11px] uppercase tracking-widest mr-1 flex items-center gap-1" style={{ color: 'var(--secondary-text)' }}>
        <Share2 className="w-3.5 h-3.5" />
        Share Story:
      </span>
      {platforms.map((p) => {
        const Icon = p.icon;
        return (
          <button
            key={p.name}
            onClick={p.onClick}
            title={`Share to ${p.name}`}
            className="px-3 py-1.5 rounded-none border vintage-border flex items-center gap-1.5 text-xs font-medium transition-all hover:-translate-y-0.5"
            style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
          >
            {Icon ? <Icon className="w-3.5 h-3.5" style={{ color: 'var(--accent-color)' }} /> : <span className="font-serif font-black" style={{ color: 'var(--accent-color)' }}>{p.label}</span>}
            <span>{p.name}</span>
          </button>
        );
      })}
      <button
        onClick={handleCopy}
        className="px-3 py-1.5 rounded-none border vintage-border flex items-center gap-1.5 text-xs font-medium transition-all"
        style={{
          backgroundColor: copied ? 'var(--accent-color)' : 'var(--bg-color)',
          color: copied ? '#FFFFFF' : 'var(--text-color)'
        }}
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <LinkIcon className="w-3.5 h-3.5" />}
        <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
      </button>
    </div>
  );
}
