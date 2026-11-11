/**
 * Input sanitization and form validation helpers
 */

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function isValidStudentId(id) {
  if (!id || typeof id !== 'string') return false;
  // Allows letters, digits, dashes, and slashes, min 3 chars
  return /^[a-zA-Z0-9\-\/]{3,20}$/.test(id.trim());
}

export function validateEventForm(formData) {
  const errors = {};

  if (!formData.title || !formData.title.trim()) {
    errors.title = 'Event title is required.';
  } else if (formData.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters.';
  }

  if (!formData.category) {
    errors.category = 'Category must be selected.';
  }

  if (!formData.date) {
    errors.date = 'Event date is required.';
  }

  if (!formData.time || !formData.time.trim()) {
    errors.time = 'Start time is required.';
  }

  if (!formData.venue || !formData.venue.trim()) {
    errors.venue = 'Venue or online link is required.';
  }

  if (!formData.organizer || !formData.organizer.trim()) {
    errors.organizer = 'Organizer or club name is required.';
  }

  if (formData.organizerContact && !isValidEmail(formData.organizerContact)) {
    errors.organizerContact = 'Please provide a valid contact email.';
  }

  const capacityNum = Number(formData.maxCapacity);
  if (!formData.maxCapacity || isNaN(capacityNum) || capacityNum <= 0) {
    errors.maxCapacity = 'Capacity must be a positive number greater than 0.';
  }

  if (!formData.shortDescription || !formData.shortDescription.trim()) {
    errors.shortDescription = 'Brief summary is required for event cards.';
  }

  if (!formData.description || !formData.description.trim()) {
    errors.description = 'Comprehensive description is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateRegistrationForm(formData) {
  const errors = {};

  if (!formData.name || !formData.name.trim()) {
    errors.name = 'Full name is required.';
  }

  if (!formData.studentId || !isValidStudentId(formData.studentId)) {
    errors.studentId = 'Please enter a valid Student ID / Roll number.';
  }

  if (!formData.email || !isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid university email address.';
  }

  if (!formData.department) {
    errors.department = 'Academic department must be selected.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
