import React from 'react';
import VintageHeader from './components/VintageHeader';
import VintageFooter from './components/VintageFooter';
import ExploreChannels from './components/ExploreChannels';
import TodaysHeadlines from './components/TodaysHeadlines';
import FeaturedNews from './components/FeaturedNews';
import NewsDetailModal from './components/NewsDetailModal';
import AdminModal from './components/AdminModal';
import ShareButtons from './components/ShareButtons';
import { useNews } from './context/NewsContext';
import { Bookmark, Trash2, ArrowLeft, Calendar, User } from 'lucide-react';

export default function App() {
  const {
    activeTab,
    setActiveTab,
    savedArticles,
    toggleSaveArticle,
    setSelectedArticle,
    formatEditorialDate
  } = useNews();

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
    >
      {/* Editorial Broadsheet Masthead Header */}
      <VintageHeader />

      {/* Main Content View */}
      <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
        {activeTab === 'home' && (
          <>
            {/* Syndicated Bureaus & Desks Strip */}
            <ExploreChannels />

            {/* Front Page Lead Story & Secondary Dispatches */}
            <FeaturedNews />

            {/* Latest Chronicle Feed (News, Stories, Articles, Video Broadcasts) */}
            <TodaysHeadlines />
          </>
        )}

        {activeTab === 'saved' && (
          <div className="py-4">
            <div
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b-2"
              style={{ borderColor: 'var(--text-color)' }}
            >
              <div>
                <button
                  onClick={() => setActiveTab('home')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest mb-2 hover:opacity-75 transition-opacity"
                  style={{ color: 'var(--accent-color)' }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Return to Front Page
                </button>
                <h2
                  className="text-2xl sm:text-3xl font-black tracking-tight"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Personal Reading Archive ({savedArticles.length})
                </h2>
                <p
                  className="text-xs mt-1"
                  style={{ color: 'var(--secondary-text)', fontFamily: "'Source Serif 4', Georgia, serif" }}
                >
                  Your curated collection of clipped dispatches, essays, and longform stories.
                </p>
              </div>
            </div>

            {savedArticles.length === 0 ? (
              <div
                className="p-14 text-center border"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
              >
                <Bookmark className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <h3
                  className="text-lg font-bold"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Your Reading Archive is Empty
                </h3>
                <p className="text-xs mt-1 max-w-md mx-auto" style={{ color: 'var(--secondary-text)' }}>
                  Click the bookmark icon on any story, news report, or video dispatch to clip it to your personal archive.
                </p>
                <button
                  onClick={() => setActiveTab('home')}
                  className="mt-5 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: 'var(--accent-color)' }}
                >
                  Browse Latest Edition
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedArticles.map((item) => (
                  <article
                    key={item._id}
                    onClick={() => setSelectedArticle(item)}
                    className="cursor-pointer border flex flex-col justify-between transition-all hover:shadow-md group"
                    style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                  >
                    <div>
                      <div className="relative h-48 overflow-hidden border-b" style={{ borderColor: 'var(--border-color)' }}>
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span
                          className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white"
                          style={{ backgroundColor: 'var(--accent-color)' }}
                        >
                          {item.postType || 'Article'} • {item.category}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveArticle(item);
                          }}
                          title="Remove from Reading List"
                          className="absolute top-3 right-3 p-1.5 bg-black/70 text-white hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="p-5">
                        <div className="flex items-center gap-3 text-[11px] mb-2" style={{ color: 'var(--secondary-text)' }}>
                          <span className="inline-flex items-center gap-1 font-semibold">
                            <User className="w-3 h-3" /> {item.author || item.channelName}
                          </span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {formatEditorialDate(item.publishDate || item.createdAt)}
                          </span>
                        </div>

                        <h3
                          className="text-lg font-bold leading-snug mb-2 group-hover:underline"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                          {item.title}
                        </h3>

                        <p
                          className="text-xs line-clamp-3 leading-relaxed"
                          style={{ color: 'var(--secondary-text)', fontFamily: "'Source Serif 4', Georgia, serif" }}
                        >
                          {item.description || item.summary}
                        </p>
                      </div>
                    </div>

                    <div
                      className="px-5 py-3 border-t flex items-center justify-between"
                      style={{ borderColor: 'var(--border-color)' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--accent-color)' }}>
                        {item.channelName}
                      </span>
                      <ShareButtons article={item} compact />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Editorial Colophon Footer */}
      <VintageFooter />

      {/* Full-Bleed Article Reader & Editorial CMS Studio Modals */}
      <NewsDetailModal />
      <AdminModal />
    </div>
  );
}
