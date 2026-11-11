import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { storageService } from '../../services/storageService';
import { Users, Mail, Hash, Calendar, Ticket, Download } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

export function AttendeeListModal({ isOpen, onClose, event }) {
  if (!event) return null;

  const registrations = storageService.getRegistrationsForEvent(event.id);

  const handleExportCSV = () => {
    if (registrations.length === 0) return;
    const headers = ["Ticket Code", "Student Name", "Student ID", "Email", "Department", "Registration Date"];
    const rows = registrations.map(r => [
      r.ticketCode,
      `"${r.studentName}"`,
      r.studentId,
      r.studentEmail,
      `"${r.department}"`,
      r.registeredAt
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendees-${event.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Attendees Roster: ${event.title}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Summary Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-xs text-slate-500 font-medium">Registered Capacity</p>
              <p className="text-sm font-bold text-slate-900">
                {registrations.length} of {event.maxCapacity} Seats ({Math.round((registrations.length / event.maxCapacity) * 100)}%)
              </p>
            </div>
          </div>

          {registrations.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
          )}
        </div>

        {/* Attendee Roster Table / Cards */}
        {registrations.length === 0 ? (
          <div className="text-center py-10 space-y-2 text-slate-500">
            <Users className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-medium">No students registered yet for this event.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Ticket</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Roll No</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/80">
                    <td className="py-2 px-3 font-mono font-bold text-indigo-600">
                      {reg.ticketCode}
                    </td>
                    <td className="py-2 px-3 font-semibold text-slate-900">
                      {reg.studentName}
                    </td>
                    <td className="py-2 px-3">{reg.studentId}</td>
                    <td className="py-2 px-3 max-w-[150px] truncate">{reg.department}</td>
                    <td className="py-2 px-3 text-slate-500">{reg.studentEmail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
