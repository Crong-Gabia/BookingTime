

export interface TimeSlotData {
  date: string;
  slots: string[];
}

export interface TimeSlot {
  isoString: string;
  time: string;
  date: string;
}

export const generateTimeSlots = (startDateString: string, endDateString: string): TimeSlotData[] => {
  if (!startDateString || !endDateString) return [];

  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return [];
  }

  const dates: string[] = [];
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      dates.push(current.toISOString());
    }
    current.setDate(current.getDate() + 1);
  }

  return dates.map((date) => {
    const slots: string[] = [];

    for (let hour = 9; hour < 18; hour++) {
      if (hour === 12) continue;

      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        const slotDate = new Date(date);
        slotDate.setHours(hour, minute, 0, 0);
        slots.push(`${slotDate.toISOString()}|${timeStr}`);
      }
    }

    return { date, slots };
  });
};

export const parseSlot = (slotString: string): TimeSlot | null => {
  const parts = slotString.split('|');
  if (parts.length !== 2) return null;

  const [isoString, time] = parts;
  const date = new Date(isoString);
  const datePart = date.toISOString().split('T')[0];

  return { isoString, time, date: datePart };
};

export const formatSlot = (slot: TimeSlot): string => {
  return `${slot.isoString}|${slot.time}`;
};

// Get slots for a specific date as structured TimeSlot objects
export const getSlotsForDate = (timeSlotData: TimeSlotData[], dateIso: string): TimeSlot[] => {
  const dateData = timeSlotData.find((ds) => ds.date === dateIso);
  if (!dateData) return [];

  return dateData.slots
    .map(parseSlot)
    .filter((slot): slot is TimeSlot => slot !== null);
};

// Format date for display (e.g., "1월 15일 (수)")
export const formatDateDisplay = (dateIso: string): string => {
  const date = new Date(dateIso);
  return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' });
};

// Format short date for calendar (e.g., "15")
export const formatShortDate = (dateIso: string): string => {
  const date = new Date(dateIso);
  return date.getDate().toString();
};

// Format range display (e.g., "1월 15일 - 1월 20일")
export const formatRangeDisplay = (startDateIso: string, endDateIso: string): string => {
  const startDate = new Date(startDateIso);
  const endDate = new Date(endDateIso);

  const startStr = startDate.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
  const endStr = endDate.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });

  if (startStr === endStr) {
    return startStr;
  }

  return `${startStr} - ${endStr}`;
};

export const isBlockedSlot = (date: string, time: string): boolean => {
  const hour = parseInt(time.split(':')[0]);
  const dayOfWeek = new Date(date).getDay();
  return hour === 12 || dayOfWeek === 0 || dayOfWeek === 6;
};
