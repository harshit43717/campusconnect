import React from 'react';
import { EventCard } from './EventCard';
import { CalendarX, Search } from 'lucide-react';
import { Button } from '../common/Button';

export function EventGrid({ events, onRegisterClick, onResetSearch }) {
  if (events.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto my-12 space-y-4">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
          <CalendarX className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">No events found</h3>
          <p className="text-sm text-slate-500">
            We couldn't find any campus events matching your current filters or keywords.
          </p>
        </div>
        {onResetSearch && (
          <Button variant="secondary" size="sm" onClick={onResetSearch} className="mt-2">
            Reset Filters & Search
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onRegisterClick={onRegisterClick}
        />
      ))}
    </div>
  );
}
