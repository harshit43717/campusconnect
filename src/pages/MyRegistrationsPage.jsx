import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';
import { useUser } from '../context/UserContext';
import { formatDate } from '../utils/dateUtils';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Sparkles,
  QrCode
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function MyRegistrationsPage() {
  const { getUserRegistrations, cancelRegistration } = useEvents();
  const { user } = useUser();
  const [ticketToCancel, setTicketToCancel] = useState(null);

  const registrations = getUserRegistrations();

  const handleConfirmCancel = () => {
    if (ticketToCancel) {
      cancelRegistration(ticketToCancel.id);
      setTicketToCancel(null);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Ticket className="w-3.5 h-3.5" />
            <span>Attendee Passes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Event Registrations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Registered passes for <span className="font-semibold text-slate-700">{user.name}</span> ({user.studentId}).
          </p>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black text-emerald-600">{registrations.length}</span>
          <p className="text-xs font-semibold text-slate-400 uppercase">Confirmed Pass{registrations.length === 1 ? '' : 'es'}</p>
        </div>
      </div>

      {/* Passes or Empty State */}
      {registrations.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-md mx-auto my-12 space-y-4">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
            <Ticket className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">No event registrations found</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              You haven't registered for any campus events yet. Explore upcoming hackathons, fests, and workshops!
            </p>
          </div>
          <Link to="/">
            <Button variant="primary" size="sm" iconRight={ArrowRight} className="mt-2">
              Explore Events
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {registrations.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between relative"
            >
              {/* Ticket Top Strip */}
              <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-300">
                    College Event Pass
                  </span>
                  <Link to={`/events/${ticket.eventId}`}>
                    <h3 className="font-bold text-base hover:text-indigo-200 transition-colors line-clamp-1">
                      {ticket.eventTitle}
                    </h3>
                  </Link>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-indigo-300 uppercase block font-semibold">Pass Code</span>
                  <span className="font-mono text-sm font-extrabold text-amber-300">
                    {ticket.ticketCode}
                  </span>
                </div>
              </div>

              {/* Ticket Body */}
              <div className="p-5 space-y-4 flex-1">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Date</span>
                    <p className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      {formatDate(ticket.eventDate)}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Time</span>
                    <p className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      {ticket.eventTime}
                    </p>
                  </div>
                </div>

                <div className="text-xs">
                  <span className="text-slate-400 font-medium">Venue</span>
                  <p className="font-bold text-slate-800 flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">{ticket.eventVenue}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-dashed border-slate-200 grid grid-cols-2 gap-2 text-xs text-slate-500">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Registered Attendee</span>
                    <span className="font-semibold text-slate-700">{ticket.studentName}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Student Roll ID</span>
                    <span className="font-semibold text-slate-700">{ticket.studentId}</span>
                  </div>
                </div>
              </div>

              {/* Ticket Bottom Actions */}
              <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/events/${ticket.eventId}`}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                >
                  View Details <ExternalLink className="w-3 h-3" />
                </Link>

                <button
                  type="button"
                  onClick={() => setTicketToCancel(ticket)}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1 transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Cancel Registration
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={Boolean(ticketToCancel)}
        onClose={() => setTicketToCancel(null)}
        title="Cancel Registration"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-900">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <p className="font-bold text-rose-950 mb-1">Release Reserved Seat</p>
              <p>
                Are you sure you want to cancel your registration for{' '}
                <span className="font-semibold text-rose-950">"{ticketToCancel?.eventTitle}"</span>?
                Your ticket pass (<span className="font-mono font-bold">{ticketToCancel?.ticketCode}</span>) will be invalidated and the seat will be released back to other students.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setTicketToCancel(null)}>
              Keep My Ticket
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmCancel}>
              Yes, Cancel Ticket
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
