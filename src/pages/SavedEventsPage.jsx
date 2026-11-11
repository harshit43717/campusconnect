import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';
import { EventGrid } from '../components/events/EventGrid';
import { RegistrationModal } from '../components/events/RegistrationModal';
import { Bookmark, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export function SavedEventsPage() {
  const { bookmarkedEvents } = useEvents();
  const [selectedEventForReg, setSelectedEventForReg] = useState(null);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>Personal Watchlist</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Saved & Bookmarked Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Keep track of campus events you're interested in attending.
          </p>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black text-indigo-600">{bookmarkedEvents.length}</span>
          <p className="text-xs font-semibold text-slate-400 uppercase">Saved Event{bookmarkedEvents.length === 1 ? '' : 's'}</p>
        </div>
      </div>

      {/* Events or Empty State */}
      {bookmarkedEvents.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-md mx-auto my-12 space-y-4">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">No saved events yet</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Click the bookmark icon on any event card to save it here for quick access later.
            </p>
          </div>
          <Link to="/">
            <Button variant="primary" size="sm" iconRight={ArrowRight} className="mt-2">
              Browse Events
            </Button>
          </Link>
        </div>
      ) : (
        <EventGrid
          events={bookmarkedEvents}
          onRegisterClick={(event) => setSelectedEventForReg(event)}
        />
      )}

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
