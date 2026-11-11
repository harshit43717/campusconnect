import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Calendar, MapPin, User, Mail, GraduationCap, Hash, CheckCircle2, Ticket } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { validateRegistrationForm } from '../../utils/validators';
import { useEvents } from '../../context/EventContext';
import { useUser } from '../../context/UserContext';

export function RegistrationModal({ isOpen, onClose, event }) {
  const { registerForEvent } = useEvents();
  const { user } = useUser();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    department: 'Computer Science & Engineering'
  });

  const [registeredTicket, setRegisteredTicket] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        studentId: user.studentId || '',
        department: user.department || 'Computer Science & Engineering'
      });
    }
    setRegisteredTicket(null);
    setErrors({});
  }, [user, event, isOpen]);

  if (!event) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateRegistrationForm(formData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    const result = registerForEvent(event.id, formData);
    setIsSubmitting(false);

    if (result.success) {
      setRegisteredTicket(result.registration);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={registeredTicket ? "Registration Confirmed!" : `Register: ${event.title}`}
    >
      {registeredTicket ? (
        /* Confirmed Ticket View */
        <div className="space-y-6 text-center py-2">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">You're Going!</h3>
            <p className="text-sm text-slate-500 mt-1">
              Your registration has been recorded in the campus event roster.
            </p>
          </div>

          {/* Ticket Card */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 text-left shadow-xl relative overflow-hidden border border-indigo-500/30">
            <div className="absolute right-[-20px] top-[-20px] w-28 h-28 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-indigo-800/80 pb-3">
              <div>
                <span className="text-[10px] tracking-widest uppercase font-bold text-indigo-300">
                  CampusConnect Pass
                </span>
                <p className="font-extrabold text-sm text-white line-clamp-1">{event.title}</p>
              </div>
              <Ticket className="w-6 h-6 text-indigo-400 shrink-0" />
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 text-xs">
              <div>
                <span className="text-indigo-300 text-[10px] uppercase font-semibold">Attendee</span>
                <p className="font-bold text-white text-sm">{registeredTicket.studentName}</p>
                <p className="text-indigo-200 text-[11px]">{registeredTicket.studentId}</p>
              </div>
              <div>
                <span className="text-indigo-300 text-[10px] uppercase font-semibold">Ticket Code</span>
                <p className="font-mono font-extrabold text-amber-300 text-sm tracking-wider">
                  {registeredTicket.ticketCode}
                </p>
              </div>
              <div>
                <span className="text-indigo-300 text-[10px] uppercase font-semibold">Date & Time</span>
                <p className="font-medium text-white">{formatDate(event.date)}</p>
                <p className="text-indigo-200 text-[11px]">{event.time}</p>
              </div>
              <div>
                <span className="text-indigo-300 text-[10px] uppercase font-semibold">Location</span>
                <p className="font-medium text-white line-clamp-1">{event.venue}</p>
              </div>
            </div>

            <div className="border-t border-dashed border-indigo-700/60 pt-3 flex items-center justify-between text-[11px] text-indigo-300">
              <span>Department: {registeredTicket.department}</span>
              <span className="text-emerald-400 font-semibold">Confirmed</span>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <Button variant="primary" onClick={onClose} className="w-full">
              Done (View Tickets)
            </Button>
          </div>
        </div>
      ) : (
        /* Registration Form */
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Mini Card Banner */}
          <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-2">
            <h4 className="font-bold text-sm text-indigo-950 leading-snug">{event.title}</h4>
            <div className="flex flex-wrap items-center gap-3 text-xs text-indigo-700">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(event.date)} • {event.time}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {event.venue}
              </span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  University Student ID / Roll No *
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    placeholder="e.g. CS-2023-4089"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                {errors.studentId && <p className="text-rose-500 text-xs mt-1">{errors.studentId}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  College Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@university.edu"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Department *
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Business Administration & Management">Business Administration & Management</option>
                  <option value="Design & Fine Arts">Design & Fine Arts</option>
                  <option value="Applied Sciences & Humanities">Applied Sciences & Humanities</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Confirming...' : 'Confirm Registration'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
