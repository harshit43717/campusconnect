import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AlertTriangle } from 'lucide-react';

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, eventTitle }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Event Confirmation" maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-900">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <p className="font-bold text-rose-950 mb-1">Warning: Irreversible Action</p>
            <p>
              Are you sure you want to delete <span className="font-semibold">"{eventTitle}"</span>?
              All student registrations and bookmarks associated with this event will also be removed.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Yes, Delete Event
          </Button>
        </div>
      </div>
    </Modal>
  );
}
