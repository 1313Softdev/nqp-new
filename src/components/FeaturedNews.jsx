import React, { useState } from 'react';
import { 
  Play, 
  Clock, 
  ThumbsUp, 
  ThumbsDown, 
  Bookmark, 
  ExternalLink, 
  Edit3, 
  Trash2,
  User,
  Calendar
} from 'lucide-react';
import { useNews, extractYouTubeId } from '../context/NewsContext';
import ShareButtons from './ShareButtons';

export default function FeaturedNews() {
  const {
    featuredNews,
    news,
    setSelectedArticle,
    savedArticles,
    toggleBookmark,
    handleReact,
    isAdminLoggedIn,
    openEditArticleModal,
    deleteNewsPost
  } = useNews();

  const [playingVideoId, setPlayingVideoId] = useState(null);

  const list = featuredNews && featuredNews.length > 0 ? featuredNews : news.slice(0, 3);
  if (!list || list.length === 0) return null;

  const leadStory = list[0];
  const sideStories = list.slice(1, 3);
  const leadYoutubeId = extractYouTubeId(leadStory.youtubeUrl);
  const isLeadSaved = savedArticles.some(a => a._id === leadStory._id);

  return (
    <section className="mb-14">
      {/* Section Title Banner */}
      <div className="flex items-center justify-between border-b-2 pb-2 mb-6" style={{ borderColor: 'var(--text-color)' }}>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 inline-block" style={{ backgroundColor: 'var(--accent-color)' }}></span>
          <h2 className="font-mono-meta text-xs uppercase tracking-[0.25em] font-bold">
            Front Page Lead & Featured Dispatches
          </h2>
        </div>
        <span className="font-mono-meta text-[11px] uppercase tracking-widest" style={{ color: 'var(--secondary-text)' }}>
          Curated Editorial Selection
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left / Main Lead Story (8 columns on lg) */}
        <article 
          onClick={() => setSelectedArticle(leadStory)}
          className="lg:col-span-8 cursor-pointer group border vintage-border p-5 sm:p-7 flex flex-col justify-between transition-all hover:shadow-md"
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          <div>
            {/* Media Box: Either YouTube Embed Player or High-Res Editorial Photo */}
            <div className="relative w-full aspect-video mb-6 overflow-hidden border vintage-border bg-black">
              {playingVideoId === leadStory._id && leadYoutubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${leadYoutubeId}?autoplay=1`}
                  title={leadStory.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <>
                  <img
                    src={leadStory.image}
                    alt={leadStory.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1000&auto=format&fit=crop&q=80';
                    }}
                  />
                  {/* Post Type & Category Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span 
                      className="px-3 py-1 text-[10px] font-mono-meta uppercase tracking-widest font-bold text-white"
                      style={{ backgroundColor: 'var(--accent-color)' }}
                    >
                      {leadStory.postType || 'Featured'}
                    </span>
                    <span className="px-3 py-1 text-[10px] font-mono-meta uppercase tracking-widest font-bold bg-black/75 text-white backdrop-blur-sm">
                      {leadStory.category}
                    </span>
                  </div>

                  {/* YouTube Play Overlay Button if post has YouTube URL */}
                  {leadYoutubeId && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlayingVideoId(leadStory._id);
                      }}
                      className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-red-600/95 hover:bg-red-600 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
                      title="Play Embedded YouTube Video"
                    >
                      <Play className="w-7 h-7 fill-white ml-0.5" />
                    </button>
                  )}

                  {/* Admin Quick Edit/Delete Overlay */}
                  {isAdminLoggedIn && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openEditArticleModal(leadStory)}
                        className="px-2.5 py-1 bg-black/80 hover:bg-black text-white text-[11px] font-mono-meta uppercase flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${leadStory.title}"?`)) {
                            deleteNewsPost(leadStory._id);
                          }
                        }}
                        className="p-1.5 bg-red-600/90 hover:bg-red-600 text-white"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Meta Line */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono-meta uppercase tracking-wider mb-3" style={{ color: 'var(--secondary-text)' }}>
              <span className="font-bold" style={{ color: 'var(--accent-color)' }}>
                {leadStory.channelName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {leadStory.author || 'Editorial Desk'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {leadStory.publishedAt || leadStory.publishDate}
              </span>
              {leadStory.readTime && (
                <>
                  <span>•</span>
                  <span>{leadStory.readTime}</span>
                </>
              )}
            </div>

            {/* Headline Title */}
            <h3 className="font-serif-display text-2xl sm:text-4xl font-bold leading-tight mb-3 group-hover:opacity-85 transition-opacity">
              {leadStory.title}
            </h3>

            {/* Subtitle / Excerpt */}
            <p className="font-editorial text-base sm:text-lg leading-relaxed line-clamp-3 mb-6" style={{ color: 'var(--secondary-text)' }}>
              {leadStory.subtitle || leadStory.description}
            </p>
          </div>

          {/* Bottom Bar: Reactions & Social Share */}
          <div className="pt-4 border-t vintage-border flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs font-mono-meta" style={{ color: 'var(--secondary-text)' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReact(leadStory._id, 'like');
                }}
                className="flex items-center gap-1.5 hover:opacity-75 transition-opacity"
              >
                <ThumbsUp className="w-3.5 h-3.5" style={{ color: 'var(--accent-color)' }} />
                <span>{leadStory.likes || 0}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReact(leadStory._id, 'dislike');
                }}
                className="flex items-center gap-1.5 hover:opacity-75 transition-opacity"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>{leadStory.dislikes || 0}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark(leadStory);
                }}
                className="flex items-center gap-1 hover:opacity-75 transition-opacity"
                style={{ color: isLeadSaved ? 'var(--accent-color)' : 'var(--secondary-text)' }}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isLeadSaved ? 'fill-current' : ''}`} />
                <span>{isLeadSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>

            <ShareButtons article={leadStory} compact />
          </div>
        </article>

        {/* Right Column: Secondary Featured Stories (4 columns on lg) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {sideStories.map((story) => {
            const ytId = extractYouTubeId(story.youtubeUrl);
            const isSaved = savedArticles.some(a => a._id === story._id);

            return (
              <article
                key={story._id}
                onClick={() => setSelectedArticle(story)}
                className="cursor-pointer group border vintage-border p-5 flex-1 flex flex-col justify-between transition-all hover:shadow-md"
                style={{ backgroundColor: 'var(--card-bg)' }}
              >
                <div>
                  <div className="relative h-44 w-full mb-4 overflow-hidden border vintage-border bg-black">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600';
                      }}
                    />
                    <span 
                      className="absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[10px] font-mono-meta uppercase tracking-widest font-bold text-white"
                      style={{ backgroundColor: 'var(--accent-color)' }}
                    >
                      {story.postType || story.category}
                    </span>
                    {ytId && (
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-1 bg-red-600 text-white text-[10px] font-mono-meta uppercase font-bold flex items-center gap-1">
                        <Play className="w-3 h-3 fill-white" />
                        Video
                      </span>
                    )}
                    {isAdminLoggedIn && (
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openEditArticleModal(story)}
                          className="p-1.5 bg-black/80 text-white hover:bg-black"
                          title="Edit Post"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${story.title}"?`)) {
                              deleteNewsPost(story._id);
                            }
                          }}
                          className="p-1.5 bg-red-600/90 text-white hover:bg-red-600"
                          title="Delete Post"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono-meta uppercase tracking-wider mb-1.5" style={{ color: 'var(--secondary-text)' }}>
                    <span className="font-bold" style={{ color: 'var(--accent-color)' }}>{story.channelName}</span>
                    <span>•</span>
                    <span>{story.publishedAt || story.publishDate}</span>
                  </div>

                  <h4 className="font-serif-display text-xl font-bold leading-snug mb-2 group-hover:opacity-80 transition-opacity">
                    {story.title}
                  </h4>

                  <p className="font-editorial text-sm line-clamp-2 mb-4" style={{ color: 'var(--secondary-text)' }}>
                    {story.subtitle || story.description}
                  </p>
                </div>

                <div className="pt-3 border-t vintage-border flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(story);
                    }}
                    className="text-xs font-mono-meta flex items-center gap-1"
                    style={{ color: isSaved ? 'var(--accent-color)' : 'var(--secondary-text)' }}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </button>
                  <ShareButtons article={story} compact />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
