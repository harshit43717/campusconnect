import React, { useState } from 'react';
import { Sparkles, Calendar, Users, Award, ShieldCheck, ArrowRight } from 'lucide-react';
import { EventFilters } from '../components/events/EventFilters';
import { SearchBar } from '../components/common/SearchBar';
import { EventGrid } from '../components/events/EventGrid';
import { RegistrationModal } from '../components/events/RegistrationModal';
import { Button } from '../components/common/Button';
import { useEvents } from '../context/EventContext';
import { Link } from 'react-router-dom';

export function HomePage() {
  const { filteredEvents, events, setSearchTerm, setSelectedCategory } = useEvents();
  const [selectedEventForReg, setSelectedEventForReg] = useState(null);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  // Featured event (first marked featured or first event)
  const featuredEvent = events.find(e => e.featured) || events[0];

  return (
    <div className="space-y-10 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white shadow-2xl p-6 sm:p-10 lg:p-12 border border-indigo-900/50">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Discover What's Happening On Campus</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.15]">
            One Hub for Every <span className="bg-gradient-to-r from-indigo-400 via-indigo-200 to-violet-300 bg-clip-text text-transparent">College Event.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Never miss another hackathon, cultural night, sports tournament, or technical bootcamp. Discover verified campus events, secure your pass in seconds, and track your schedule.
          </p>

          {/* Quick Metrics */}
          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-indigo-300">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white text-base leading-none">{events.length}</p>
                <p className="text-[11px] text-slate-400">Active Events</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-emerald-300">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white text-base leading-none">
                  {events.reduce((sum, e) => sum + (e.registeredCount || 0), 0)}+
                </p>
                <p className="text-[11px] text-slate-400">Students Attending</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-300">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white text-base leading-none">Verified</p>
                <p className="text-[11px] text-slate-400">Official Campus Clubs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discovery Controls: Categories, Search, Filters */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Upcoming College Events
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Filter by department category or search for specific organizers and topics.
            </p>
          </div>
        </div>

        {/* Categories Pills */}
        <EventFilters />

        {/* Search Bar & Sorter */}
        <SearchBar />
      </section>

      {/* Events Grid */}
      <section>
        <EventGrid
          events={filteredEvents}
          onRegisterClick={(event) => setSelectedEventForReg(event)}
          onResetSearch={handleResetFilters}
        />
      </section>

      {/* Registration Modal */}
      {selectedEventForReg && (
        <RegistrationModal
          isOpen={Boolean(selectedEventForReg)}
          onClose={() => setSelectedEventForReg(null)}
          event={selectedEventForReg}
        />
      )}

    </div>
  );
}
