import { IHolidayAdapter } from './interfaces';

export class HolidayAdapter implements IHolidayAdapter {
  async isHoliday(_date: Date): Promise<boolean> {
    return false;
  }
}
