import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { formatDate, isPastEvent } from '../utils/dateUtils';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { RegistrationModal } from '../components/events/RegistrationModal';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Bookmark,
  Share2,
  ArrowLeft,
  Mail,
  Video,
  CheckCircle2,
  CalendarCheck,
  ShieldCheck,
  ExternalLink,
  Info
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, isEventBookmarked, toggleBookmark, isUserRegistered } = useEvents();
  const { showSuccess } = useToast();

  const [isRegModalOpen, setIsRegModalOpen] = useState(false);

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="text-center py-24 space-y-4 max-w-md mx-auto">
        <h2 className="text-2xl font-black text-slate-900">Event Not Found</h2>
        <p className="text-sm text-slate-500">
          The event you are looking for may have been removed or does not exist.
        </p>
        <Link to="/">
          <Button variant="primary" icon={ArrowLeft}>
            Back to Events
          </Button>
        </Link>
      </div>
    );
  }

  const isBookmarked = isEventBookmarked(event.id);
  const registered = isUserRegistered(event.id);
  const isPast = isPastEvent(event.date, event.time);
  const capacity = event.maxCapacity || 100;
  const registeredCount = event.registeredCount || 0;
  const isFull = registeredCount >= capacity;
  const capacityPercent = Math.min(100, Math.round((registeredCount / capacity) * 100));

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showSuccess('Event link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* Navigation & Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Share2}
            onClick={handleShare}
          >
            Share
          </Button>
          <Button
            variant={isBookmarked ? 'brand' : 'secondary'}
            size="sm"
            icon={Bookmark}
            onClick={() => toggleBookmark(event.id)}
          >
            {isBookmarked ? 'Saved' : 'Save Event'}
          </Button>
        </div>
      </div>

      {/* Hero Poster */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-21/9 max-h-[420px] w-full bg-slate-900">
        <img
          src={event.posterUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80"}
          alt={event.title}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Badges on Poster */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <Badge category={event.category}>
            {event.category}
          </Badge>
          {event.isVirtual ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-sm">
              <Video className="w-3.5 h-3.5" /> Virtual Event
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-md">
              In-Person
            </span>
          )}
        </div>

        {/* Title over Poster Bottom */}
        <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
          <p className="text-xs sm:text-sm font-semibold text-indigo-300 uppercase tracking-wider">
            Organized by {event.organizer}
          </p>
          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Main Grid: Details + Registration Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Content & Schedule) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Logistics Quick Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Date & Time</p>
                <p className="text-sm font-bold text-slate-900">{formatDate(event.date)}</p>
                <p className="text-xs text-slate-500">{event.time} {event.endTime ? `to ${event.endTime}` : ''}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Venue / Location</p>
                <p className="text-sm font-bold text-slate-900">{event.venue}</p>
                {event.meetingLink && (
                  <a
                    href={event.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-600 hover:underline inline-flex items-center gap-1 mt-0.5"
                  >
                    Join Virtual Room <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              About This Event
            </h3>
            <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-4 whitespace-pre-line">
              {event.description}
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-400">Tags:</span>
                {event.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Schedule / Agenda Section */}
          {event.schedule && event.schedule.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span>Event Schedule & Itinerary</span>
              </h3>
              <div className="space-y-4">
                {event.schedule.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 pb-3 border-b border-slate-50 last:border-none">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg shrink-0">
                      {item.time}
                    </span>
                    <p className="text-sm font-medium text-slate-700 leading-snug pt-0.5">
                      {item.activity}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Eligibility & Guidelines */}
          {event.eligibility && (
            <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl flex items-start gap-3">
              <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Eligibility</p>
                <p className="text-sm text-slate-600 leading-relaxed">{event.eligibility}</p>
              </div>
            </div>
          )}

        </div>

        {/* Right Sidebar: Registration Card */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-lg space-y-5 sticky top-24">
            
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Registration Status
              </span>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-black text-slate-900">
                  {isPast ? 'Event Ended' : isFull ? 'Sold Out' : 'Open'}
                </p>
                <span className="text-xs font-semibold text-slate-500">
                  Free Student Pass
                </span>
              </div>
            </div>

            {/* Capacity Meter */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Seats Booked</span>
                </span>
                <span className="font-bold text-slate-800">
                  {registeredCount} / {capacity} ({capacityPercent}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all rounded-full ${
                    isFull ? 'bg-rose-500' : capacityPercent > 80 ? 'bg-amber-500' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${capacityPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 text-right">
                {Math.max(0, capacity - registeredCount)} seats remaining
              </p>
            </div>

            {/* CTA Button */}
            <div className="space-y-3 pt-2">
              {registered ? (
                <div className="space-y-2">
                  <div className="w-full py-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    You are registered!
                  </div>
                  <Link to="/my-registrations" className="block text-center">
                    <Button variant="secondary" size="sm" className="w-full">
                      View My Pass
                    </Button>
                  </Link>
                </div>
              ) : isPast ? (
                <Button variant="secondary" disabled className="w-full">
                  Registration Closed
                </Button>
              ) : isFull ? (
                <Button variant="secondary" disabled className="w-full text-rose-600">
                  Capacity Reached
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full shadow-lg shadow-indigo-200"
                  onClick={() => setIsRegModalOpen(true)}
                >
                  Register Now
                </Button>
              )}
            </div>

            {/* Organizer Support Box */}
            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-500">
              <p className="font-bold text-slate-700">Need Help or Have Questions?</p>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="truncate">{event.organizerContact || 'events@university.edu'}</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
        event={event}
      />

    </div>
  );
}
