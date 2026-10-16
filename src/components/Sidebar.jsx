import React from 'react';
import { 
  Home, 
  Compass, 
  Bookmark, 
  Rss, 
  Mail, 
  Settings, 
  LogOut, 
  Globe,
  ShieldCheck
} from 'lucide-react';
import { useNews } from '../context/NewsContext';
import SubscribeCard from './SubscribeCard';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { activeTab, setActiveTab, setIsAdminOpen, savedArticles, isAdminLoggedIn, logoutAdmin } = useNews();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'saved', label: 'Saved', icon: Bookmark, badge: savedArticles.length > 0 ? savedArticles.length : null },
    { id: 'subscriptions', label: 'Subscriptions', icon: Rss },
    { id: 'messages', label: 'Messages', icon: Mail, badge: 2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className={`
      fixed lg:sticky top-0 left-0 z-40 h-screen w-[260px] bg-white border-r border-[#F0EDFF] flex flex-col p-6 transition-transform duration-300 ease-in-out shrink-0
      ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-2xl bg-[#6C5CE7] flex items-center justify-center text-white shadow-md shadow-[#6C5CE7]/30">
          <Globe className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-gray-900 leading-tight">
            News for All
          </h1>
          <p className="text-[11px] font-semibold text-[#6C5CE7] tracking-wider uppercase">
            Global Portal
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (setMobileOpen) setMobileOpen(false);
              }}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-150 group
                ${isActive 
                  ? 'bg-[#EDE9FE] text-[#6C5CE7] shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[#6C5CE7]' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${isActive ? 'bg-[#6C5CE7] text-white' : 'bg-[#6C5CE7] text-white'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Admin Dashboard Entry (Only visible when Admin is logged in) */}
        {isAdminLoggedIn && (
          <button
            onClick={() => {
              setIsAdminOpen(true);
              if (setMobileOpen) setMobileOpen(false);
            }}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold text-[#6C5CE7] bg-[#EDE9FE]/50 hover:bg-[#EDE9FE] transition-all duration-150 mt-3 border border-[#DDD6FE]"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#6C5CE7]" />
              <span>Admin Panel</span>
            </div>
            <span className="text-[10px] uppercase font-extrabold bg-[#6C5CE7] text-white px-2 py-0.5 rounded-md">
              Active
            </span>
          </button>
        )}
      </nav>

      {/* Logout / Admin Login button */}
      <div className="pt-2 border-t border-gray-100">
        {isAdminLoggedIn ? (
          <button 
            onClick={logoutAdmin}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 rounded-2xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        ) : (
          <button 
            onClick={() => {
              setIsAdminOpen(true);
              if (setMobileOpen) setMobileOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Admin Login</span>
          </button>
        )}
      </div>

      {/* Subscription Card */}
      <SubscribeCard />
    </aside>
  );
}
