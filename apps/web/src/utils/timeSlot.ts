

export interface TimeSlotData {
  date: string;
  slots: string[];
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

export const isBlockedSlot = (date: string, time: string): boolean => {
  const hour = parseInt(time.split(':')[0]);
  const dayOfWeek = new Date(date).getDay();
  return hour === 12 || dayOfWeek === 0 || dayOfWeek === 6;
};
