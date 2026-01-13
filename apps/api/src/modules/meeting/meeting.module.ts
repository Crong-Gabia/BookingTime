import { Module } from '@nestjs/common';
import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { RoomAdapter } from './adapters/room.adapter';
import { HolidayAdapter } from './adapters/holiday.adapter';
import { HrAdapter } from './adapters/hr.adapter';

@Module({
  imports: [PrismaModule],
  controllers: [MeetingController],
  providers: [
    MeetingService,
    { provide: 'IRoomAdapter', useClass: RoomAdapter },
    { provide: 'IHolidayAdapter', useClass: HolidayAdapter },
    { provide: 'IHrAdapter', useClass: HrAdapter },
  ],
  exports: [MeetingService],
})
export class MeetingModule {}
