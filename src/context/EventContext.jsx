import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { useToast } from './ToastContext';
import { useUser } from './UserContext';

const EventContext = createContext(null);

export function EventProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date-asc'); // 'date-asc' | 'date-desc' | 'popular' | 'title'
  const [isLoading, setIsLoading] = useState(true);

  const { showSuccess, showError, showInfo } = useToast();
  const { user } = useUser();

  // Load initial data from storage
  const reloadData = useCallback(() => {
    try {
      const storedEvents = storageService.getEvents();
      const storedBookmarks = storageService.getBookmarks();
      const storedRegistrations = storageService.getRegistrations();

      setEvents(storedEvents);
      setBookmarks(storedBookmarks);
      setRegistrations(storedRegistrations);
    } catch (err) {
      console.error('Failed to load initial data:', err);
      showError('Failed to load campus events.');
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  // Bookmarking
  const toggleBookmark = useCallback((eventId) => {
    try {
      const { bookmarks: updatedBookmarks, isBookmarked } = storageService.toggleBookmark(eventId);
      setBookmarks(updatedBookmarks);
      if (isBookmarked) {
        showSuccess('Event saved to your bookmarks!');
      } else {
        showInfo('Event removed from your bookmarks.');
      }
    } catch (err) {
      showError('Could not update bookmark.');
    }
  }, [showSuccess, showInfo, showError]);

  const isEventBookmarked = useCallback((eventId) => {
    return bookmarks.includes(eventId);
  }, [bookmarks]);

  // Registrations
  const registerForEvent = useCallback((eventId, studentData) => {
    try {
      const newReg = storageService.registerForEvent(eventId, studentData);
      reloadData();
      showSuccess(`Registration confirmed! Your Ticket ID is ${newReg.ticketCode}`);
      return { success: true, registration: newReg };
    } catch (err) {
      showError(err.message || 'Registration failed.');
      return { success: false, error: err.message };
    }
  }, [reloadData, showSuccess, showError]);

  const cancelRegistration = useCallback((registrationId) => {
    try {
      const success = storageService.cancelRegistration(registrationId);
      if (success) {
        reloadData();
        showInfo('Your event registration has been cancelled.');
        return true;
      }
      return false;
    } catch (err) {
      showError('Failed to cancel registration.');
      return false;
    }
  }, [reloadData, showInfo, showError]);

  const isUserRegistered = useCallback((eventId) => {
    if (!user?.email) return false;
    return registrations.some(r => r.eventId === eventId && (r.studentEmail === user.email || r.studentId === user.studentId));
  }, [registrations, user]);

  const getUserRegistrations = useCallback(() => {
    if (!user?.email) return [];
    return registrations.filter(r => r.studentEmail === user.email || r.studentId === user.studentId);
  }, [registrations, user]);

  // Admin Actions
  const createEvent = useCallback((eventData) => {
    try {
      const newEvent = storageService.createEvent(eventData);
      reloadData();
      showSuccess(`Event "${newEvent.title}" has been published!`);
      return newEvent;
    } catch (err) {
      showError('Failed to create event.');
      throw err;
    }
  }, [reloadData, showSuccess, showError]);

  const updateEvent = useCallback((id, updatedFields) => {
    try {
      const updated = storageService.updateEvent(id, updatedFields);
      reloadData();
      showSuccess('Event details updated successfully!');
      return updated;
    } catch (err) {
      showError('Failed to update event.');
      throw err;
    }
  }, [reloadData, showSuccess, showError]);

  const deleteEvent = useCallback((id) => {
    try {
      storageService.deleteEvent(id);
      reloadData();
      showSuccess('Event deleted successfully.');
      return true;
    } catch (err) {
      showError('Failed to delete event.');
      return false;
    }
  }, [reloadData, showSuccess, showError]);

  const resetAllData = useCallback(() => {
    storageService.resetToDefaultEvents();
    reloadData();
    showSuccess('Campus events reset to default template data.');
  }, [reloadData, showSuccess]);

  // Filtered & Sorted events calculation
  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      // Search filter (title, description, organizer, tags)
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = !term ||
        evt.title?.toLowerCase().includes(term) ||
        evt.shortDescription?.toLowerCase().includes(term) ||
        evt.organizer?.toLowerCase().includes(term) ||
        evt.venue?.toLowerCase().includes(term) ||
        (evt.tags && evt.tags.some(t => t.toLowerCase().includes(term)));

      // Category filter
      const matchesCategory = selectedCategory === 'all' || evt.category === selectedCategory;

      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'date-asc') {
        return new Date(a.date) - new Date(b.date);
      }
      if (sortBy === 'date-desc') {
        return new Date(b.date) - new Date(a.date);
      }
      if (sortBy === 'popular') {
        return (b.registeredCount || 0) - (a.registeredCount || 0);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [events, searchTerm, selectedCategory, sortBy]);

  // Bookmarked events list
  const bookmarkedEvents = useMemo(() => {
    return events.filter(evt => bookmarks.includes(evt.id));
  }, [events, bookmarks]);

  const value = {
    events,
    filteredEvents,
    bookmarkedEvents,
    bookmarks,
    registrations,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    isLoading,
    toggleBookmark,
    isEventBookmarked,
    registerForEvent,
    cancelRegistration,
    isUserRegistered,
    getUserRegistrations,
    createEvent,
    updateEvent,
    deleteEvent,
    resetAllData,
    reloadData
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
