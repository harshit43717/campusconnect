import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useEvents } from '../../context/EventContext';

export function SearchBar() {
  const { searchTerm, setSearchTerm, sortBy, setSortBy, filteredEvents } = useEvents();

  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200/80 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
      {/* Search Input Box */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by event title, organizer, venue, or keywords (e.g. AI, Music)..."
          className="w-full pl-11 pr-10 py-2.5 rounded-xl border border-transparent bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Controls: Match count + Sort Selector */}
      <div className="flex items-center justify-between md:justify-end gap-3 pl-1 md:pl-0">
        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
          <span className="text-indigo-600 font-bold">{filteredEvents.length}</span> event{filteredEvents.length === 1 ? '' : 's'} found
        </span>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors"
          >
            <option value="date-asc">Date: Earliest First</option>
            <option value="date-desc">Date: Latest First</option>
            <option value="popular">Most Popular (Registrations)</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
