import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  PieChart, 
  Calendar, 
  ChevronDown, 
  SlidersHorizontal,
  Menu,
  X,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useNews } from '../context/NewsContext';

export default function TopBar({ mobileOpen, setMobileOpen }) {
  const { searchQuery, setSearchQuery, twoLatestPerChannel, setTwoLatestPerChannel, setIsAdminOpen, isAdminLoggedIn } = useNews();
  const [selectedLocation, setSelectedLocation] = useState('San Francisco, California');
  const [selectedType, setSelectedType] = useState('Analysis');
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');

  return (
    <header className="sticky top-0 z-30 bg-[#F5F6FA]/90 backdrop-blur-md py-4 px-4 sm:px-8 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
      {/* Left Brand / Mobile Admin Menu Toggle */}
      <div className={`flex items-center gap-3 ${isAdminLoggedIn ? 'lg:hidden' : ''}`}>
        {isAdminLoggedIn && (
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#6C5CE7] flex items-center justify-center text-white shadow-sm shadow-[#6C5CE7]/30 font-extrabold text-sm">
            N4A
          </div>
          <span className="font-extrabold text-gray-900 text-lg tracking-tight">News for All</span>
        </div>
      </div>

      {/* Dropdown Filters (Location, Analysis, Monthly) */}
      <div className="hidden md:flex items-center gap-3">
        {/* Location Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-2xl border border-gray-100 text-xs font-bold text-gray-700 shadow-sm hover:border-[#6C5CE7]/30 transition-all">
            <MapPin className="w-4 h-4 text-[#6C5CE7]" />
            <span>{selectedLocation}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>

        {/* Analysis Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-2xl border border-gray-100 text-xs font-bold text-gray-700 shadow-sm hover:border-[#6C5CE7]/30 transition-all">
            <PieChart className="w-4 h-4 text-orange-500" />
            <span>{selectedType}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>

        {/* Period Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-2xl border border-gray-100 text-xs font-bold text-gray-700 shadow-sm hover:border-[#6C5CE7]/30 transition-all">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span>{selectedPeriod}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>
      </div>

      {/* Search Input & Action Icons */}
      <div className="flex items-center gap-3 flex-1 max-w-md justify-end">
        {/* Search Field */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for anything..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-2xl text-xs font-medium text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/10 transition-all"
          />
        </div>

        {/* Admin 2-Latest-News Display Toggle Pill (Visible to Admin) */}
        {isAdminLoggedIn && (
          <button
            onClick={() => setTwoLatestPerChannel(!twoLatestPerChannel)}
            title="Admin Rule: Display only two latest news from all channels"
            className={`
              hidden sm:flex items-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 border
              ${twoLatestPerChannel 
                ? 'bg-[#6C5CE7] text-white border-[#6C5CE7] shadow-md shadow-[#6C5CE7]/20' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }
            `}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>2 Latest / Channel</span>
          </button>
        )}

        {/* Action Icon Button */}
        <button 
          onClick={() => setIsAdminOpen(true)}
          className="p-2.5 rounded-2xl bg-[#6C5CE7] text-white shadow-md shadow-[#6C5CE7]/30 hover:bg-[#5B4BC4] transition-all shrink-0"
          title={isAdminLoggedIn ? "Open Admin Dashboard" : "Admin Login"}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {/* User Profile Avatar */}
        <button 
          onClick={() => setIsAdminOpen(true)}
          className="relative group shrink-0"
          title={isAdminLoggedIn ? "Admin Session Active - Click to Manage" : "Click to Login"}
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="User profile"
            className="w-10 h-10 rounded-2xl object-cover border-2 border-white shadow-sm ring-2 ring-gray-100 group-hover:ring-[#6C5CE7] transition-all"
          />
          <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${isAdminLoggedIn ? 'bg-[#6C5CE7]' : 'bg-emerald-500'}`}></span>
        </button>
      </div>
    </header>
  );
}
