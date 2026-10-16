import React from 'react';
import { ExternalLink, Plus, Edit3, Trash2 } from 'lucide-react';
import { useNews } from '../context/NewsContext';

export default function ExploreChannels() {
  const {
    channels,
    activeChannel,
    setActiveChannel,
    isAdminLoggedIn,
    setIsAdminOpen,
    setAdminInitialTab,
    deleteChannel
  } = useNews();

  return (
    <section className="mb-10">
      <div className="border-y vintage-border py-3 px-4" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar py-1 flex-1">
            <span 
              className="font-mono-meta text-[11px] uppercase tracking-widest font-bold shrink-0 pr-2 border-r vintage-border"
              style={{ color: 'var(--accent-color)' }}
            >
              Syndicated Bureaus & Desks:
            </span>

            <button
              onClick={() => setActiveChannel('All')}
              className={`px-3 py-1 text-xs font-mono-meta uppercase tracking-wider border transition-all shrink-0 ${
                activeChannel === 'All' ? 'font-bold' : 'hover:opacity-75'
              }`}
              style={{
                backgroundColor: activeChannel === 'All' ? 'var(--text-color)' : 'transparent',
                color: activeChannel === 'All' ? 'var(--bg-color)' : 'var(--text-color)',
                borderColor: activeChannel === 'All' ? 'var(--text-color)' : 'var(--border-color)'
              }}
            >
              All Desks
            </button>

            {channels.map((channel) => {
              const isSelected = activeChannel.toLowerCase() === channel.name.toLowerCase();
              return (
                <div
                  key={channel._id || channel.name}
                  onClick={() => setActiveChannel(isSelected ? 'All' : channel.name)}
                  className={`cursor-pointer group flex items-center gap-2 px-3 py-1 border transition-all shrink-0 ${
                    isSelected ? 'font-bold shadow-sm' : 'hover:opacity-85'
                  }`}
                  style={{
                    backgroundColor: isSelected ? 'var(--accent-color)' : 'var(--bg-color)',
                    color: isSelected ? '#FFFFFF' : 'var(--text-color)',
                    borderColor: isSelected ? 'var(--accent-color)' : 'var(--border-color)'
                  }}
                >
                  {channel.logo && (
                    <img
                      src={channel.logo}
                      alt={channel.name}
                      className="w-4 h-4 object-contain rounded-sm bg-white p-0.5"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <span className="text-xs font-mono-meta uppercase tracking-wider">
                    {channel.name}
                  </span>

                  {channel.url && channel.url !== '#' && (
                    <a
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title={`Visit ${channel.name}`}
                      className="opacity-60 hover:opacity-100 transition-opacity ml-0.5"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {isAdminLoggedIn && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete channel "${channel.name}"?`)) {
                          deleteChannel(channel._id);
                        }
                      }}
                      title="Delete Bureau"
                      className="opacity-60 hover:opacity-100 text-red-400 hover:text-red-600 ml-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Admin Add Channel Button (Only shown when logged in) */}
          {isAdminLoggedIn && (
            <button
              onClick={() => {
                setAdminInitialTab('channels');
                setIsAdminOpen(true);
              }}
              className="px-3 py-1 border border-dashed text-xs font-mono-meta uppercase tracking-wider flex items-center gap-1 shrink-0 transition-opacity hover:opacity-80"
              style={{ borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Desk / Channel</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
