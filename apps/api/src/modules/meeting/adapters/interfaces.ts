export interface IRoomAdapter {
  isAvailable(timeSlot: string, location?: string): Promise<boolean>;
}

export interface IHolidayAdapter {
  isHoliday(date: Date): Promise<boolean>;
}

export interface IHrAdapter {
  getUserName(userId: string): string;
}
