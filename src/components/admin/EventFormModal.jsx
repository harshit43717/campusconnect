import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CATEGORIES } from '../../data/categories';
import { Image, Calendar, Clock, MapPin, Users, Mail, User, Tag, Sparkles } from 'lucide-react';
import { validateEventForm } from '../../utils/validators';

const PRESET_POSTERS = [
  { label: 'Hackathon', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Festival / Concert', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Coding / Workshop', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Sports', url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Conference', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Gaming', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80' }
];

export function EventFormModal({ isOpen, onClose, event = null, onSave }) {
  const isEditing = Boolean(event && event.id);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Technical',
    date: '',
    time: '10:00 AM',
    endDate: '',
    endTime: '',
    venue: '',
    isVirtual: false,
    meetingLink: '',
    maxCapacity: 100,
    organizer: '',
    organizerContact: '',
    posterUrl: PRESET_POSTERS[0].url,
    shortDescription: '',
    description: '',
    tagsString: '',
    eligibility: 'Open to all students'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        category: event.category || 'Technical',
        date: event.date || '',
        time: event.time || '10:00 AM',
        endDate: event.endDate || '',
        endTime: event.endTime || '',
        venue: event.venue || '',
        isVirtual: Boolean(event.isVirtual),
        meetingLink: event.meetingLink || '',
        maxCapacity: event.maxCapacity || 100,
        organizer: event.organizer || '',
        organizerContact: event.organizerContact || '',
        posterUrl: event.posterUrl || PRESET_POSTERS[0].url,
        shortDescription: event.shortDescription || '',
        description: event.description || '',
        tagsString: event.tags ? event.tags.join(', ') : '',
        eligibility: event.eligibility || 'Open to all students'
      });
    } else {
      // Defaults for new event
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 7);
      const defaultDateStr = tomorrow.toISOString().split('T')[0];

      setFormData({
        title: '',
        category: 'Technical',
        date: defaultDateStr,
        time: '10:00 AM',
        endDate: '',
        endTime: '',
        venue: 'Campus Innovation Center',
        isVirtual: false,
        meetingLink: '',
        maxCapacity: 80,
        organizer: 'Student Council',
        organizerContact: 'events@university.edu',
        posterUrl: PRESET_POSTERS[0].url,
        shortDescription: '',
        description: '',
        tagsString: 'Campus, Student Event',
        eligibility: 'Open to all enrolled students'
      });
    }
    setErrors({});
  }, [event, isOpen]);

  const validate = () => {
    const { isValid, errors: errs } = validateEventForm(formData);
    setErrors(errs);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const tags = formData.tagsString
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      maxCapacity: Number(formData.maxCapacity),
      tags,
    };
    delete payload.tagsString;

    onSave(payload);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Campus Event' : 'Create New Campus Event'}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Event Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. AI & Robotics Innovation Showcase 2026"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
          {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* Category & Capacity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Maximum Attendee Capacity *
            </label>
            <div className="relative">
              <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="1"
                max="5000"
                value={formData.maxCapacity}
                onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {errors.maxCapacity && <p className="text-rose-500 text-xs mt-1">{errors.maxCapacity}</p>}
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Event Date *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {errors.date && <p className="text-rose-500 text-xs mt-1">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Start Time *
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="e.g. 10:00 AM"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {errors.time && <p className="text-rose-500 text-xs mt-1">{errors.time}</p>}
          </div>
        </div>

        {/* Venue & Online Mode */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-700">
              Location / Venue *
            </label>
            <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isVirtual}
                onChange={(e) => setFormData({ ...formData, isVirtual: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
              />
              Virtual / Online Event
            </label>
          </div>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              placeholder={formData.isVirtual ? "e.g. Google Meet / Zoom link" : "e.g. Academic Block 3, Seminar Hall 2"}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {errors.venue && <p className="text-rose-500 text-xs mt-1">{errors.venue}</p>}
        </div>

        {/* Organizer info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Organizer / Club Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                placeholder="e.g. Robotics Club"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {errors.organizer && <p className="text-rose-500 text-xs mt-1">{errors.organizer}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={formData.organizerContact}
                onChange={(e) => setFormData({ ...formData, organizerContact: e.target.value })}
                placeholder="club@university.edu"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Poster Image URL & Quick Presets */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Event Poster Image URL
          </label>
          <div className="relative">
            <Image className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              value={formData.posterUrl}
              onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] text-slate-400 font-medium">Quick presets:</span>
            {PRESET_POSTERS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setFormData({ ...formData, posterUrl: preset.url })}
                className={`text-[11px] px-2 py-0.5 rounded-lg border transition-colors ${
                  formData.posterUrl === preset.url
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Short Summary */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Short Tagline / Summary (Shown on Cards) *
          </label>
          <input
            type="text"
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            placeholder="A punchy 1-2 sentence description for event discovery cards"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.shortDescription && <p className="text-rose-500 text-xs mt-1">{errors.shortDescription}</p>}
        </div>

        {/* Full Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Event Details & Agenda *
          </label>
          <textarea
            rows="4"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Provide comprehensive details: schedule, rules, what to bring, prizes, and FAQs..."
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
          {errors.description && <p className="text-rose-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tags (comma-separated)
          </label>
          <div className="relative">
            <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={formData.tagsString}
              onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
              placeholder="e.g. AI, Workshop, Prizes, Beginners"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {isEditing ? 'Save Changes' : 'Publish Event'}
          </Button>
        </div>

      </form>
    </Modal>
  );
}
