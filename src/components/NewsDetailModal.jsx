import React from 'react';
import { 
  X, 
  ExternalLink, 
  ThumbsUp, 
  ThumbsDown, 
  Calendar, 
  User, 
  Bookmark, 
  Edit3, 
  Trash2, 
  Youtube,
  Tag
} from 'lucide-react';
import { useNews, extractYouTubeId } from '../context/NewsContext';
import ShareButtons from './ShareButtons';

export default function NewsDetailModal() {
  const {
    selectedArticle,
    setSelectedArticle,
    handleReact,
    savedArticles,
    toggleBookmark,
    isAdminLoggedIn,
    openEditArticleModal,
    deleteNewsPost
  } = useNews();

  if (!selectedArticle) return null;

  const isSaved = savedArticles.some((a) => a._id === selectedArticle._id);
  const youtubeId = extractYouTubeId(selectedArticle.youtubeUrl);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={() => setSelectedArticle(null)}
    >
      <article
        className="relative w-full max-w-4xl border-2 vintage-border shadow-2xl my-auto max-h-[92vh] overflow-y-auto"
        style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar inside Reader */}
        <div 
          className="sticky top-0 z-20 px-6 py-3 border-b vintage-border flex items-center justify-between"
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          <div className="flex items-center gap-2 text-xs font-mono-meta uppercase tracking-widest">
            <span 
              className="px-2.5 py-0.5 font-bold text-white"
              style={{ backgroundColor: 'var(--accent-color)' }}
            >
              {selectedArticle.postType || 'Article'}
            </span>
            <span style={{ color: 'var(--secondary-text)' }}>•</span>
            <span className="font-bold">{selectedArticle.category}</span>
          </div>

          <div className="flex items-center gap-2">
            {isAdminLoggedIn && (
              <>
                <button
                  onClick={() => {
                    const art = selectedArticle;
                    setSelectedArticle(null);
                    openEditArticleModal(art);
                  }}
                  className="px-3 py-1 border vintage-border text-xs font-mono-meta uppercase flex items-center gap-1 hover:opacity-80"
                  style={{ backgroundColor: 'var(--bg-color)' }}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Post</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete "${selectedArticle.title}"?`)) {
                      deleteNewsPost(selectedArticle._id);
                    }
                  }}
                  className="px-3 py-1 bg-red-600 text-white text-xs font-mono-meta uppercase flex items-center gap-1 hover:bg-red-700"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </>
            )}

            <button
              onClick={() => setSelectedArticle(null)}
              className="p-1.5 border vintage-border hover:opacity-75 transition-opacity"
              aria-label="Close Reader"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Editorial Header */}
        <div className="px-6 sm:px-12 pt-8 pb-6 border-b vintage-border">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono-meta uppercase tracking-widest mb-4" style={{ color: 'var(--secondary-text)' }}>
            <span className="font-bold" style={{ color: 'var(--accent-color)' }}>
              {selectedArticle.channelName || 'News for All'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              By {selectedArticle.author || 'Editorial Desk'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {selectedArticle.publishedAt || selectedArticle.publishDate}
            </span>
            {selectedArticle.readTime && (
              <>
                <span>•</span>
                <span>{selectedArticle.readTime}</span>
              </>
            )}
          </div>

          <h1 className="font-serif-display text-3xl sm:text-5xl font-black leading-tight mb-4">
            {selectedArticle.title}
          </h1>

          {selectedArticle.subtitle && (
            <p className="font-editorial text-lg sm:text-xl italic leading-relaxed" style={{ color: 'var(--secondary-text)' }}>
              {selectedArticle.subtitle}
            </p>
          )}
        </div>

        {/* Embedded YouTube Video Player (if YouTube URL exists) */}
        {youtubeId && (
          <div className="px-6 sm:px-12 pt-8">
            <div className="border vintage-border p-2" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title={selectedArticle.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="pt-2 px-1 flex items-center justify-between text-[11px] font-mono-meta" style={{ color: 'var(--secondary-text)' }}>
                <span className="flex items-center gap-1.5 text-red-600 font-bold uppercase">
                  <Youtube className="w-4 h-4" />
                  Embedded Video Dispatch
                </span>
                <a
                  href={selectedArticle.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:opacity-80"
                >
                  Watch directly on YouTube ↗
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Feature Image (shown when no YouTube video or alongside story) */}
        {selectedArticle.image && (
          <div className="px-6 sm:px-12 pt-8">
            <figure className="border vintage-border p-2" style={{ backgroundColor: 'var(--card-bg)' }}>
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full max-h-[460px] object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1000';
                }}
              />
              <figcaption className="pt-2 px-1 text-[11px] font-mono-meta uppercase tracking-wider" style={{ color: 'var(--secondary-text)' }}>
                Photograph / Illustration — {selectedArticle.channelName} Archive
              </figcaption>
            </figure>
          </div>
        )}

        {/* Full Story Body with Editorial Typography & Dropcap */}
        <div className="px-6 sm:px-12 py-8">
          {selectedArticle.description && selectedArticle.description.trim() !== '' ? (
            <div className="font-editorial text-lg sm:text-xl leading-relaxed space-y-5 editorial-dropcap whitespace-pre-line">
              {selectedArticle.description}
            </div>
          ) : (
            <p className="font-editorial text-lg leading-relaxed editorial-dropcap">
              This dispatch was published by {selectedArticle.channelName} under the {selectedArticle.category} desk.
              {selectedArticle.url ? ' Follow the official source link below to inspect the external archive.' : ''}
            </p>
          )}

          {/* Tags */}
          {selectedArticle.tags && selectedArticle.tags.length > 0 && (
            <div className="mt-8 pt-4 border-t vintage-border flex flex-wrap items-center gap-2">
              <Tag className="w-3.5 h-3.5" style={{ color: 'var(--secondary-text)' }} />
              {selectedArticle.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 text-xs font-mono-meta uppercase border vintage-border"
                  style={{ backgroundColor: 'var(--card-bg)', color: 'var(--secondary-text)' }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Reactions, Save & External Link Bar */}
          <div className="mt-8 py-5 border-y vintage-border flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleReact(selectedArticle._id, 'like')}
                className="px-4 py-2 border vintage-border flex items-center gap-2 text-xs font-mono-meta uppercase hover:opacity-80"
                style={{ backgroundColor: 'var(--card-bg)' }}
              >
                <ThumbsUp className="w-4 h-4" style={{ color: 'var(--accent-color)' }} />
                <span>Endorse ({selectedArticle.likes || 0})</span>
              </button>

              <button
                onClick={() => handleReact(selectedArticle._id, 'dislike')}
                className="px-4 py-2 border vintage-border flex items-center gap-2 text-xs font-mono-meta uppercase hover:opacity-80"
                style={{ backgroundColor: 'var(--card-bg)' }}
              >
                <ThumbsDown className="w-4 h-4" />
                <span>({selectedArticle.dislikes || 0})</span>
              </button>

              <button
                onClick={() => toggleBookmark(selectedArticle)}
                className="px-4 py-2 border vintage-border flex items-center gap-2 text-xs font-mono-meta uppercase hover:opacity-80"
                style={{
                  backgroundColor: isSaved ? 'var(--accent-color)' : 'var(--card-bg)',
                  color: isSaved ? '#FFFFFF' : 'var(--text-color)'
                }}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                <span>{isSaved ? 'Saved in Reading List' : 'Save Story'}</span>
              </button>
            </div>

            {selectedArticle.url && selectedArticle.url.trim() !== '' && selectedArticle.url !== '#' && (
              <a
                href={selectedArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 text-xs font-mono-meta uppercase tracking-wider font-bold text-white flex items-center gap-2 transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                <span>Visit Original Source URL</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Full Social Share Bar (Facebook, Instagram, LinkedIn, Medium, X, WhatsApp, Copy) */}
          <div className="mt-6">
            <ShareButtons article={selectedArticle} />
          </div>
        </div>
      </article>
    </div>
  );
}
