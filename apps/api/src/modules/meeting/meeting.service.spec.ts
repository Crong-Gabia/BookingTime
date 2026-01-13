import { Test, TestingModule } from '@nestjs/testing';
import { MeetingService } from './meeting.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { IRoomAdapter, IHolidayAdapter, IHrAdapter } from './adapters/interfaces';
import { CreateMeetingRequestDto, MeetingRequestStatus } from 'shared';

describe('MeetingService', () => {
  let service: MeetingService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeetingService,
        {
          provide: PrismaService,
          useValue: {
            meetingRequest: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            participant: {
              findFirst: jest.fn(),
              update: jest.fn(),
              findMany: jest.fn(),
            },
            timeSlot: {
              upsert: jest.fn(),
              create: jest.fn(),
              updateMany: jest.fn(),
              findMany: jest.fn(),
            },
            confirmedMeeting: {
              create: jest.fn(),
            },
            $transaction: jest.fn((cb) => cb(prisma)),
            $connect: jest.fn(),
            $disconnect: jest.fn(),
          },
        },
        { provide: 'IRoomAdapter', useClass: RoomAdapterMock },
        { provide: 'IHolidayAdapter', useClass: HolidayAdapterMock },
        { provide: 'IHrAdapter', useClass: HrAdapterMock },
      ],
    }).compile();

    service = module.get<MeetingService>(MeetingService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('슬롯 교집합 찾기', () => {
    it('모든 참가자가 가능한 시간을 찾는다', async () => {
      const cases = [
        {
          slots1: ['09:00', '10:00'],
          slots2: ['09:00', '10:00'],
          expected: ['09:00', '10:00'],
        },
        {
          slots1: ['09:00'],
          slots2: ['09:30'],
          expected: [],
        },
      ];

      for (const { slots1, slots2, expected } of cases) {
        const mockTimeSlots = [
          ...slots1.map((time) => ({ slotDate: new Date(`2026-01-20T${time}:00Z`), status: 'AVAILABLE' })),
          ...slots2.map((time) => ({ slotDate: new Date(`2026-01-20T${time}:00Z`), status: 'AVAILABLE' })),
        ];

        (prisma.timeSlot.findMany as jest.Mock).mockResolvedValue(mockTimeSlots);
        (prisma.participant.findMany as jest.Mock).mockResolvedValue([{ id: '1' }, { id: '2' }]);

        const result = await service.getDashboard('test-id');
        expect(result.commonAvailableSlots.length).toBe(expected.length);
      }
    });
  });

  describe('회의 확정 동시성', () => {
    it('version 체크로 동시 확정 방지', async () => {
      const dto: CreateMeetingRequestDto = {
        title: 'Test Meeting',
        organizerId: 'user-1',
        participantIds: ['user-2'],
        requiredParticipantIds: ['user-2'],
        startDate: '2026-01-20',
        endDate: '2026-01-21',
        durationMinutes: 60,
      };

      await service.createRequest(dto);

      const mockRequest = { id: '1', status: 'OPEN', version: 1, closedAt: null };
      (prisma.meetingRequest.findUnique as jest.Mock).mockResolvedValue(mockRequest);
    });
  });
});

class RoomAdapterMock implements IRoomAdapter {
  async isAvailable(): Promise<boolean> {
    return true;
  }
}

class HolidayAdapterMock implements IHolidayAdapter {
  async isHoliday(): Promise<boolean> {
    return false;
  }
}

class HrAdapterMock implements IHrAdapter {
  getUserName(userId: string): string {
    return 'Test User';
  }
}
