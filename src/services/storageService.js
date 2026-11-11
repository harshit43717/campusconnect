import { INITIAL_EVENTS } from '../data/initialEvents';

const STORAGE_KEYS = {
  EVENTS: 'campusconnect_events_v1',
  REGISTRATIONS: 'campusconnect_registrations_v1',
  BOOKMARKS: 'campusconnect_bookmarks_v1',
  CURRENT_USER: 'campusconnect_user_v1'
};

// Safe JSON parser with fallback
function safeGet(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to parse ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Failed to write ${key} to localStorage:`, err);
    return false;
  }
}

export const storageService = {
  // ─── EVENTS ─────────────────────────────────────────────────────────────
  getEvents() {
    let events = safeGet(STORAGE_KEYS.EVENTS, null);
    if (!events || !Array.isArray(events) || events.length === 0) {
      events = INITIAL_EVENTS;
      safeSet(STORAGE_KEYS.EVENTS, events);
    }
    return events;
  },

  getEventById(id) {
    const events = this.getEvents();
    return events.find(e => e.id === id) || null;
  },

  createEvent(eventData) {
    const events = this.getEvents();
    const newEvent = {
      ...eventData,
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      registeredCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    events.unshift(newEvent);
    safeSet(STORAGE_KEYS.EVENTS, events);
    return newEvent;
  },

  updateEvent(id, updatedFields) {
    const events = this.getEvents();
    const index = events.findIndex(e => e.id === id);
    if (index === -1) return null;

    events[index] = {
      ...events[index],
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };
    safeSet(STORAGE_KEYS.EVENTS, events);
    return events[index];
  },

  deleteEvent(id) {
    let events = this.getEvents();
    events = events.filter(e => e.id !== id);
    safeSet(STORAGE_KEYS.EVENTS, events);

    // Cascade delete in registrations
    let registrations = this.getRegistrations();
    registrations = registrations.filter(r => r.eventId !== id);
    safeSet(STORAGE_KEYS.REGISTRATIONS, registrations);

    // Cascade delete in bookmarks
    let bookmarks = this.getBookmarks();
    bookmarks = bookmarks.filter(bId => bId !== id);
    safeSet(STORAGE_KEYS.BOOKMARKS, bookmarks);

    return true;
  },

  resetToDefaultEvents() {
    safeSet(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    return INITIAL_EVENTS;
  },

  // ─── REGISTRATIONS ──────────────────────────────────────────────────────
  getRegistrations() {
    return safeGet(STORAGE_KEYS.REGISTRATIONS, []);
  },

  registerForEvent(eventId, studentData) {
    const events = this.getEvents();
    const event = events.find(e => e.id === eventId);
    if (!event) throw new Error("Event not found.");

    if (event.registeredCount >= event.maxCapacity) {
      throw new Error("Sorry, this event has reached maximum capacity!");
    }

    const registrations = this.getRegistrations();
    const alreadyRegistered = registrations.some(
      r => r.eventId === eventId && (r.studentEmail === studentData.email || r.studentId === studentData.studentId)
    );

    if (alreadyRegistered) {
      throw new Error("You are already registered for this event with this Student ID or Email!");
    }

    const newRegistration = {
      id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventId,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventVenue: event.venue,
      eventCategory: event.category,
      studentName: studentData.name,
      studentEmail: studentData.email,
      studentId: studentData.studentId,
      department: studentData.department,
      registeredAt: new Date().toISOString(),
      ticketCode: `CC-${Math.floor(100000 + Math.random() * 900000)}`
    };

    registrations.unshift(newRegistration);
    safeSet(STORAGE_KEYS.REGISTRATIONS, registrations);

    // Increment registeredCount on event
    this.updateEvent(eventId, {
      registeredCount: (event.registeredCount || 0) + 1
    });

    return newRegistration;
  },

  cancelRegistration(registrationId) {
    const registrations = this.getRegistrations();
    const target = registrations.find(r => r.id === registrationId);
    if (!target) return false;

    const remaining = registrations.filter(r => r.id !== registrationId);
    safeSet(STORAGE_KEYS.REGISTRATIONS, remaining);

    // Decrement registeredCount on event
    const event = this.getEventById(target.eventId);
    if (event && event.registeredCount > 0) {
      this.updateEvent(target.eventId, {
        registeredCount: Math.max(0, event.registeredCount - 1)
      });
    }

    return true;
  },

  isRegistered(eventId, studentEmail) {
    if (!studentEmail) return false;
    const registrations = this.getRegistrations();
    return registrations.some(r => r.eventId === eventId && r.studentEmail === studentEmail);
  },

  getRegistrationsForEvent(eventId) {
    const registrations = this.getRegistrations();
    return registrations.filter(r => r.eventId === eventId);
  },

  // ─── BOOKMARKS ──────────────────────────────────────────────────────────
  getBookmarks() {
    return safeGet(STORAGE_KEYS.BOOKMARKS, []);
  },

  toggleBookmark(eventId) {
    const bookmarks = this.getBookmarks();
    const index = bookmarks.indexOf(eventId);
    let updated;
    let isBookmarked = false;

    if (index > -1) {
      updated = bookmarks.filter(id => id !== eventId);
      isBookmarked = false;
    } else {
      updated = [...bookmarks, eventId];
      isBookmarked = true;
    }

    safeSet(STORAGE_KEYS.BOOKMARKS, updated);
    return { bookmarks: updated, isBookmarked };
  },

  isBookmarked(eventId) {
    const bookmarks = this.getBookmarks();
    return bookmarks.includes(eventId);
  },

  // ─── USER PROFILE / SESSION ─────────────────────────────────────────────
  getUserProfile() {
    return safeGet(STORAGE_KEYS.CURRENT_USER, {
      name: "Alex Rivera",
      studentId: "CS-2023-4089",
      email: "alex.rivera@university.edu",
      department: "Computer Science & Engineering",
      role: "student" // 'student' | 'admin'
    });
  },

  saveUserProfile(profile) {
    safeSet(STORAGE_KEYS.CURRENT_USER, profile);
    return profile;
  }
};
