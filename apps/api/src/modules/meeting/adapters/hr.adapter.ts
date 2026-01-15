import { IHrAdapter } from './interfaces';

export class HrAdapter implements IHrAdapter {
  getUserName(_userId: string): string {
    void _userId;
    return '사용자';
  }
}
