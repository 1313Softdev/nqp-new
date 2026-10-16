import React, { useState } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Bookmark, 
  ExternalLink, 
  Sparkles, 
  Play, 
  Edit3, 
  Trash2, 
  User, 
  Calendar,
  BookOpen
} from 'lucide-react';
import { useNews, extractYouTubeId } from '../context/NewsContext';
import ShareButtons from './ShareButtons';

const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num || '0';
};

export default function TodaysHeadlines() {
  const {
    news,
    loading,
    handleReact,
    setSelectedArticle,
    twoLatestPerChannel,
    setTwoLatestPerChannel,
    savedArticles,
    toggleBookmark,
    isAdminLoggedIn,
    openEditArticleModal,
    deleteNewsPost,
    activeCategory,
    activePostType,
    activeChannel
  } = useNews();

  const [playingCardId, setPlayingCardId] = useState(null);

  return (
    <section className="mb-16">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 pb-2 mb-8" style={{ borderColor: 'var(--text-color)' }}>
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 inline-block" style={{ backgroundColor: 'var(--accent-color)' }}></span>
          <h2 className="font-mono-meta text-xs uppercase tracking-[0.25em] font-bold">
            {activeCategory !== 'All' ? `${activeCategory} — Archive & Dispatches` : 'The Chronicle — Latest News, Stories & Articles'}
          </h2>
          {twoLatestPerChannel && (
            <span 
              className="px-2 py-0.5 text-[10px] font-mono-meta uppercase tracking-wider font-bold text-white"
              style={{ backgroundColor: 'var(--accent-color)' }}
            >
              2 Latest / Channel Rule Active
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs font-mono-meta">
          <span style={{ color: 'var(--secondary-text)' }}>
            Showing {news.length} {news.length === 1 ? 'Dispatch' : 'Dispatches'}
          </span>
          {isAdminLoggedIn && (
            <button
              onClick={() => setTwoLatestPerChannel(!twoLatestPerChannel)}
              className="underline font-bold"
              style={{ color: 'var(--accent-color)' }}
            >
              {twoLatestPerChannel ? 'Show Full Archive' : 'Limit 2 / Channel'}
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border vintage-border p-5 animate-pulse space-y-4" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="h-48 bg-stone-200 w-full"></div>
              <div className="h-4 bg-stone-200 w-1/3"></div>
              <div className="h-6 bg-stone-200 w-5/6"></div>
              <div className="h-12 bg-stone-200 w-full"></div>
            </div>
          ))}
        </div>
      ) : news.length === 0 ? (
        <div className="border vintage-border p-12 text-center" style={{ backgroundColor: 'var(--card-bg)' }}>
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <h3 className="font-serif-display text-xl font-bold mb-1">No Stories or Articles Found</h3>
          <p className="font-editorial text-sm" style={{ color: 'var(--secondary-text)' }}>
            No dispatches match the current category or search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => {
            const isSaved = savedArticles.some((a) => a._id === item._id);
            const youtubeId = extractYouTubeId(item.youtubeUrl);

            return (
              <article
                key={item._id}
                onClick={() => setSelectedArticle(item)}
                className="cursor-pointer group border vintage-border p-5 flex flex-col justify-between transition-all hover:shadow-md"
                style={{ backgroundColor: 'var(--card-bg)' }}
              >
                <div>
                  {/* Image or Embedded YouTube Player */}
                  <div className="relative h-52 w-full mb-4 overflow-hidden border vintage-border bg-black">
                    {playingCardId === item._id && youtubeId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                        title={item.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <>
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600';
                          }}
                        />

                        {/* Badges */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span
                            className="px-2.5 py-0.5 text-[10px] font-mono-meta uppercase tracking-widest font-bold text-white"
                            style={{ backgroundColor: 'var(--accent-color)' }}
                          >
                            {item.postType || 'Article'}
                          </span>
                          <span className="px-2.5 py-0.5 text-[10px] font-mono-meta uppercase tracking-widest font-bold bg-black/75 text-white backdrop-blur-sm">
                            {item.category || 'News'}
                          </span>
                        </div>

                        {/* YouTube Play Overlay Button */}
                        {youtubeId && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPlayingCardId(item._id);
                            }}
                            className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-red-600/95 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                            title="Play YouTube Video"
                          >
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </button>
                        )}

                        {/* Admin Edit / Delete Overlay */}
                        {isAdminLoggedIn && (
                          <div
                            className="absolute top-2.5 right-2.5 flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => openEditArticleModal(item)}
                              className="px-2 py-1 bg-black/85 hover:bg-black text-white text-[10px] font-mono-meta uppercase flex items-center gap-1"
                              title="Edit Story"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete "${item.title}"?`)) {
                                  deleteNewsPost(item._id);
                                }
                              }}
                              className="p-1 bg-red-600/90 hover:bg-red-600 text-white"
                              title="Delete Story"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Metadata Line */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-meta uppercase tracking-wider mb-2" style={{ color: 'var(--secondary-text)' }}>
                    <span className="font-bold truncate max-w-[140px]" style={{ color: 'var(--accent-color)' }}>
                      {item.channelName || 'News for All'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.publishedAt || item.publishDate || 'Oct 2026'}
                    </span>
                  </div>

                  {/* Story Title */}
                  <h3 className="font-serif-display text-xl font-bold leading-snug mb-2 group-hover:opacity-80 transition-opacity line-clamp-2">
                    {item.title}
                  </h3>

                  {/* Excerpt / Description */}
                  <p className="font-editorial text-sm leading-relaxed line-clamp-3 mb-4" style={{ color: 'var(--secondary-text)' }}>
                    {item.subtitle || item.description || 'Click to read the full story and editorial report.'}
                  </p>

                  {/* Author & Read Time */}
                  <div className="flex items-center justify-between text-[11px] font-mono-meta pb-3 mb-3 border-b vintage-border" style={{ color: 'var(--secondary-text)' }}>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {item.author || 'Editorial Desk'}
                    </span>
                    <span>{item.readTime || '5 min read'}</span>
                  </div>
                </div>

                {/* Footer Actions: Reactions, Bookmark, External Link & Share */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-3 text-xs font-mono-meta" style={{ color: 'var(--secondary-text)' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReact(item._id, 'like');
                      }}
                      className="flex items-center gap-1 hover:opacity-75"
                      title="Upvote Story"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" style={{ color: 'var(--accent-color)' }} />
                      <span>{formatNumber(item.likes)}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReact(item._id, 'dislike');
                      }}
                      className="flex items-center gap-1 hover:opacity-75"
                      title="Downvote Story"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>{formatNumber(item.dislikes)}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(item);
                      }}
                      className="hover:opacity-75"
                      style={{ color: isSaved ? 'var(--accent-color)' : 'var(--secondary-text)' }}
                      title="Bookmark Story"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    </button>

                    {item.url && item.url.trim() !== '' && item.url !== '#' && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Open External Source Link"
                        className="hover:opacity-75"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <ShareButtons article={item} compact />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
