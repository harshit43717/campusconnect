export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatTime(timeString) {
  return timeString || '';
}

export function isPastEvent(dateString, timeString) {
  if (!dateString) return false;
  const eventDateTime = new Date(`${dateString}T${timeString ? parseTimeTo24(timeString) : '23:59:59'}`);
  return eventDateTime < new Date();
}

function parseTimeTo24(timeStr) {
  try {
    const parts = timeStr.trim().match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (!parts) return timeStr;
    let hours = parseInt(parts[1], 10);
    const minutes = parts[2];
    const modifier = parts[3] ? parts[3].toUpperCase() : null;

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return `${String(hours).padStart(2, '0')}:${minutes}:00`;
  } catch {
    return '00:00:00';
  }
}

export function getDaysRemaining(dateString) {
  if (!dateString) return null;
  const eventDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);

  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays > 1) return `In ${diffDays} days`;
  return 'Past';
}
