import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Bookmark, CheckCircle2, ArrowRight, Video } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatDate, getDaysRemaining, isPastEvent } from '../../utils/dateUtils';
import { useEvents } from '../../context/EventContext';

export function EventCard({ event, onRegisterClick }) {
  const { isEventBookmarked, toggleBookmark, isUserRegistered } = useEvents();

  const isBookmarked = isEventBookmarked(event.id);
  const registered = isUserRegistered(event.id);
  const isPast = isPastEvent(event.date, event.time);

  const capacity = event.maxCapacity || 100;
  const registeredCount = event.registeredCount || 0;
  const isFull = registeredCount >= capacity;
  const capacityPercent = Math.min(100, Math.round((registeredCount / capacity) * 100));
  const daysLeft = getDaysRemaining(event.date);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Card Header & Poster */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={event.posterUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80"}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap pointer-events-auto">
            <Badge category={event.category}>
              {event.category}
            </Badge>
            {event.isVirtual ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/90 text-white backdrop-blur-xs">
                <Video className="w-3 h-3" /> Online
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900/80 text-white backdrop-blur-xs">
                On-Campus
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleBookmark(event.id);
            }}
            className={`pointer-events-auto p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
              isBookmarked
                ? 'bg-amber-500 text-white'
                : 'bg-white/90 text-slate-700 hover:bg-white hover:text-amber-500'
            }`}
            title={isBookmarked ? "Remove bookmark" : "Save event"}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Banner on Image (Time / Days remaining) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
          <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-indigo-300" />
            {formatDate(event.date)}
          </span>
          {daysLeft && !isPast && (
            <span className="bg-indigo-600/90 text-white font-semibold px-2 py-0.5 rounded-md text-[11px]">
              {daysLeft}
            </span>
          )}
          {isPast && (
            <span className="bg-slate-700/90 text-slate-300 font-semibold px-2 py-0.5 rounded-md text-[11px]">
              Past Event
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          {/* Organizer */}
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
            {event.organizer}
          </p>

          {/* Title */}
          <Link to={`/events/${event.id}`}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
              {event.title}
            </h3>
          </Link>

          {/* Description snippet */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {event.shortDescription || event.description}
          </p>

          {/* Logistics Info (Time & Venue) */}
          <div className="pt-2 space-y-1.5 text-xs text-slate-600 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Capacity Bar & Footer Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
          {/* Capacity Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-400" />
                <span>Seats Filled</span>
              </span>
              <span className={`font-semibold ${isFull ? 'text-rose-600 font-bold' : 'text-slate-700'}`}>
                {registeredCount} / {capacity} ({capacityPercent}%)
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isFull
                    ? 'bg-rose-500'
                    : capacityPercent > 80
                    ? 'bg-amber-500'
                    : 'bg-indigo-600'
                }`}
                style={{ width: `${capacityPercent}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <Link to={`/events/${event.id}`} className="flex-1">
              <Button variant="secondary" size="sm" className="w-full">
                <span>Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>

            {registered ? (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Registered
              </span>
            ) : isPast ? (
              <span className="px-3 py-1.5 text-xs font-semibold text-slate-400 bg-slate-100 rounded-xl">
                Ended
              </span>
            ) : isFull ? (
              <span className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 rounded-xl border border-rose-100">
                Sold Out
              </span>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onRegisterClick && onRegisterClick(event)}
              >
                Register
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
