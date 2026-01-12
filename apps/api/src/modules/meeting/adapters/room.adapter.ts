import { IRoomAdapter } from './interfaces';

export class RoomAdapter implements IRoomAdapter {
  async isAvailable(_timeSlot: string, _location?: string): Promise<boolean> {
    return true;
  }
}
