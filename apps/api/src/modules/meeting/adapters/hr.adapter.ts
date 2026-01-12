import { IHrAdapter } from './interfaces';

export class HrAdapter implements IHrAdapter {
  getUserName(_userId: string): string {
    return '사용자';
  }
}
