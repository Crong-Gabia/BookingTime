import { IRoomAdapter } from './interfaces';

export class RoomAdapter implements IRoomAdapter {
  async isAvailable(_timeSlot: string, _location?: string): Promise<boolean> {
    void _timeSlot;
    void _location;
    return true;
  }
}
