import React, { useState, useMemo } from 'react';
import { useEvents } from '../context/EventContext';
import { useUser } from '../context/UserContext';
import { StatCard } from '../components/admin/StatCard';
import { EventFormModal } from '../components/admin/EventFormModal';
import { DeleteConfirmModal } from '../components/admin/DeleteConfirmModal';
import { AttendeeListModal } from '../components/events/AttendeeListModal';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatDate, isPastEvent } from '../utils/dateUtils';
import {
  Calendar,
  Users,
  Plus,
  Edit2,
  Trash2,
  Eye,
  RefreshCw,
  Search,
  CheckCircle,
  Video,
  ShieldCheck,
  TrendingUp,
  Download,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminDashboardPage() {
  const { events, createEvent, updateEvent, deleteEvent, resetAllData } = useEvents();
  const { role, switchRole } = useUser();

  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const [attendeeModalOpen, setAttendeeModalOpen] = useState(false);
  const [attendeeEvent, setAttendeeEvent] = useState(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // Compute metrics
  const totalEvents = events.length;
  const totalRegistrations = events.reduce((sum, e) => sum + (e.registeredCount || 0), 0);
  const totalCapacity = events.reduce((sum, e) => sum + (e.maxCapacity || 0), 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;
  const virtualCount = events.filter(e => e.isVirtual).length;

  // Filtered table rows
  const displayedEvents = useMemo(() => {
    return events.filter(e => {
      const matchSearch = !searchFilter ||
        e.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        e.organizer.toLowerCase().includes(searchFilter.toLowerCase()) ||
        e.venue.toLowerCase().includes(searchFilter.toLowerCase());

      const matchCat = categoryFilter === 'all' || e.category === categoryFilter;

      return matchSearch && matchCat;
    });
  }, [events, searchFilter, categoryFilter]);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (evt) => {
    setEditingEvent(evt);
    setFormModalOpen(true);
  };

  const handleOpenDelete = (evt) => {
    setEventToDelete(evt);
    setDeleteModalOpen(true);
  };

  const handleOpenAttendees = (evt) => {
    setAttendeeEvent(evt);
    setAttendeeModalOpen(true);
  };

  const handleSaveForm = (formData) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, formData);
    } else {
      createEvent(formData);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Event Management Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Create, edit, monitor registration capacity, and export attendee rosters.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={() => setResetModalOpen(true)}
            title="Reset data"
          >
            Reset Seed Data
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={handleOpenCreate}
            className="shadow-md shadow-indigo-200"
          >
            Add New Event
          </Button>
        </div>
      </div>

      {/* Analytics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Events"
          value={totalEvents}
          subtitle="Active on platform"
          icon={Calendar}
          color="indigo"
        />
        <StatCard
          title="Total Registrations"
          value={totalRegistrations}
          subtitle="Confirmed student seats"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Capacity Occupancy"
          value={`${occupancyRate}%`}
          subtitle={`${totalRegistrations} of ${totalCapacity} seats`}
          icon={TrendingUp}
          color="amber"
        />
        <StatCard
          title="Online / Hybrid"
          value={virtualCount}
          subtitle="Virtual room streams"
          icon={Video}
          color="purple"
        />
      </div>

      {/* Event Management Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {/* Table Controls (Search & Category filter) */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search table by title, organizer, or venue..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              <option value="Technical">Technical</option>
              <option value="Cultural">Cultural</option>
              <option value="Sports">Sports</option>
              <option value="Workshop">Workshop</option>
              <option value="Academic">Academic</option>
              <option value="Gaming">Gaming</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Event Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Capacity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {displayedEvents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No matching events found in admin directory.
                  </td>
                </tr>
              ) : (
                displayedEvents.map((evt) => {
                  const isPast = isPastEvent(evt.date, evt.time);
                  const isFull = (evt.registeredCount || 0) >= (evt.maxCapacity || 0);

                  return (
                    <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Title & Organizer */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={evt.posterUrl}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                          <div>
                            <Link
                              to={`/events/${evt.id}`}
                              className="font-bold text-slate-900 hover:text-indigo-600 line-clamp-1 text-sm"
                            >
                              {evt.title}
                            </Link>
                            <p className="text-[11px] text-slate-400">
                              {evt.organizer} • {evt.venue}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <Badge category={evt.category}>
                          {evt.category}
                        </Badge>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <p className="font-semibold text-slate-800">{formatDate(evt.date)}</p>
                        <p className="text-[11px] text-slate-400">{evt.time}</p>
                      </td>

                      {/* Capacity / Seats */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <p className="font-bold text-slate-800">
                            {evt.registeredCount || 0} / {evt.maxCapacity}
                          </p>
                          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                isFull ? 'bg-rose-500' : 'bg-indigo-600'
                              }`}
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.round(((evt.registeredCount || 0) / (evt.maxCapacity || 1)) * 100)
                                )}%`
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isPast ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500">
                            Past
                          </span>
                        ) : isFull ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Full
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Active
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* Attendee Roster Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenAttendees(evt)}
                            title="View registered attendees"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <Users className="w-4 h-4" />
                          </button>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(evt)}
                            title="Edit event"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(evt)}
                            title="Delete event"
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-400">
          <span>Displaying {displayedEvents.length} events</span>
          <span className="text-[11px]">CampusConnect Administration</span>
        </div>

      </div>

      {/* Create / Edit Form Modal */}
      <EventFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        event={editingEvent}
        onSave={handleSaveForm}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        eventTitle={eventToDelete?.title}
        onConfirm={() => {
          if (eventToDelete) {
            deleteEvent(eventToDelete.id);
          }
        }}
      />

      {/* Attendee Roster Modal */}
      <AttendeeListModal
        isOpen={attendeeModalOpen}
        onClose={() => setAttendeeModalOpen(false)}
        event={attendeeEvent}
      />

      {/* Reset Seed Data Confirmation Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset Sample Data"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-100 rounded-xl text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <p className="font-bold text-amber-950 mb-1">Restore Default Campus Dataset</p>
              <p>
                This will reset the event list back to the original 6 curated campus events (HackCampus, PULSE Fest, React Bootcamp, Futsal, AI Summit, Esports).
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setResetModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                resetAllData();
                setResetModalOpen(false);
              }}
            >
              Reset Data
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
