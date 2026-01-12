import { Injectable, Inject, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  CreateMeetingRequestDto,
  CreateMeetingResponseDto,
  CreateParticipantResponseDto,
  DashboardDto,
  ConfirmMeetingDto,
  ConfirmMeetingResponseDto,
  RemindResponseDto,
  ERROR_CODES,
  MeetingRequestStatus,
} from '@shared/dto';
import { MeetingStatus, SlotStatus } from '@prisma/client';
import { IRoomAdapter, IHolidayAdapter, IHrAdapter } from './adapters/interfaces';

@Injectable()
export class MeetingService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('IRoomAdapter') private readonly roomAdapter: IRoomAdapter,
    @Inject('IHolidayAdapter') private readonly holidayAdapter: IHolidayAdapter,
    @Inject('IHrAdapter') private readonly hrAdapter: IHrAdapter,
  ) {}

  async createRequest(dto: CreateMeetingRequestDto): Promise<CreateMeetingResponseDto> {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (startDate >= endDate) {
      throw new BadRequestException(ERROR_CODES.INVALID_TIME_RANGE, 'Invalid date range');
    }

    const request = await this.prisma.meetingRequest.create({
      data: {
        title: dto.title,
        organizerId: dto.organizerId,
        startDate,
        endDate,
        durationMinutes: dto.durationMinutes,
        location: dto.location,
        status: MeetingStatus.OPEN,
        participants: {
          create: dto.participantIds.map((userId) => ({
            userId,
            name: this.hrAdapter.getUserName(userId),
          })),
        },
      },
    });

    await this.generateTimeSlots(request.id, request.startDate, request.endDate);

    return {
      id: request.id,
      title: request.title,
      organizerId: request.organizerId,
      status: request.status as MeetingRequestStatus,
      startDate: request.startDate.toISOString(),
      endDate: request.endDate.toISOString(),
      durationMinutes: request.durationMinutes,
      createdAt: request.createdAt.toISOString(),
    };
  }

  async getDashboard(requestId: string): Promise<DashboardDto> {
    const request = await this.prisma.meetingRequest.findUnique({
      where: { id: requestId },
      include: {
        participants: true,
      },
    });

    if (!request) {
      throw new NotFoundException('Meeting request not found');
    }

    const commonSlots = await this.findCommonAvailableSlots(requestId);

    return {
      requestId: request.id,
      title: request.title,
      status: request.status as MeetingRequestStatus,
      participants: request.participants.map((p) => ({
        userId: p.userId,
        name: p.name,
        responded: p.responded,
      })),
      commonAvailableSlots: commonSlots,
      createdAt: request.createdAt.toISOString(),
      closedAt: request.closedAt?.toISOString(),
    };
  }

  async createResponse(requestId: string, dto: CreateParticipantResponseDto): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const request = await tx.meetingRequest.findUnique({ where: { id: requestId } });

      if (!request) {
        throw new NotFoundException('Meeting request not found');
      }

      if (request.status === MeetingStatus.CONFIRMED || request.closedAt) {
        throw new BadRequestException(ERROR_CODES.REQUEST_CLOSED, 'Request is closed');
      }

      const participant = await tx.participant.findFirst({
        where: { requestId, userId: dto.userId },
      });

      if (!participant) {
        throw new NotFoundException(ERROR_CODES.PARTICIPANT_NOT_FOUND, 'Participant not found');
      }

      await tx.participant.update({
        where: { id: participant.id },
        data: { responded: true },
      });

      const slotDates = this.parseSlotDates(dto.availableSlots, dto.unavailableSlots);

      for (const slotDate of slotDates.available) {
        await tx.timeSlot.upsert({
          where: {
            id: this.getSlotId(requestId, participant.id, slotDate),
          },
          update: { status: SlotStatus.AVAILABLE },
          create: {
            requestId,
            participantId: participant.id,
            slotDate: new Date(slotDate),
            status: SlotStatus.AVAILABLE,
          },
        });
      }

      for (const slotDate of slotDates.unavailable) {
        await tx.timeSlot.upsert({
          where: {
            id: this.getSlotId(requestId, participant.id, slotDate),
          },
          update: { status: SlotStatus.UNAVAILABLE },
          create: {
            requestId,
            participantId: participant.id,
            slotDate: new Date(slotDate),
            status: SlotStatus.UNAVAILABLE,
          },
        });
      }
    });
  }

  async remindParticipant(requestId: string, userId: string): Promise<RemindResponseDto> {
    const participant = await this.prisma.participant.findFirst({
      where: { requestId, userId },
    });

    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    const now = new Date();
    if (participant.remindedAt && now.getTime() - participant.remindedAt.getTime() < 10 * 60 * 1000) {
      return { userId, sent: false };
    }

    await this.prisma.participant.update({
      where: { id: participant.id },
      data: { remindedAt: now },
    });

    return { userId, sent: true };
  }

  async confirmMeeting(dto: ConfirmMeetingDto): Promise<ConfirmMeetingResponseDto> {
    return this.prisma.$transaction(async (tx) => {
      const request = await tx.meetingRequest.findUnique({
        where: { id: dto.requestId },
        select: { id: true, status: true, version: true, closedAt: true },
      });

      if (!request) {
        throw new NotFoundException('Meeting request not found');
      }

      if (request.status === MeetingStatus.CONFIRMED || request.closedAt) {
        throw new BadRequestException(ERROR_CODES.REQUEST_CLOSED, 'Request is closed');
      }

      const isRoomAvailable = await this.roomAdapter.isAvailable(dto.selectedTimeSlot, dto.location);
      if (!isRoomAvailable) {
        throw new ConflictException(ERROR_CODES.ROOM_TAKEN, 'Room is already taken');
      }

      const confirmed = await tx.confirmedMeeting.create({
        data: {
          requestId: dto.requestId,
          selectedTimeSlot: new Date(dto.selectedTimeSlot),
          location: dto.location,
        },
      });

      await tx.meetingRequest.update({
        where: { id: dto.requestId },
        data: {
          status: MeetingStatus.CONFIRMED,
          closedAt: new Date(),
          version: request.version + 1,
        },
      });

      return {
        id: confirmed.id,
        requestId: confirmed.requestId,
        selectedTimeSlot: confirmed.selectedTimeSlot.toISOString(),
        location: confirmed.location,
        confirmedAt: confirmed.confirmedAt.toISOString(),
      };
    });
  }

  private async generateTimeSlots(requestId: string, startDate: Date, endDate: Date) {
    const current = new Date(startDate);
    current.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    while (current <= end) {
      const dayOfWeek = current.getDay();

      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const isHoliday = await this.holidayAdapter.isHoliday(current);

        for (let hour = 9; hour < 18; hour++) {
          if (hour === 12) continue;

          for (let minute = 0; minute < 60; minute += 30) {
            const slotTime = new Date(current);
            slotTime.setHours(hour, minute, 0, 0);

            await this.prisma.timeSlot.create({
              data: {
                requestId,
                slotDate: slotTime,
                status: isHoliday ? SlotStatus.BLOCKED : SlotStatus.AVAILABLE,
              },
            });
          }
        }
      }

      current.setDate(current.getDate() + 1);
    }
  }

  private async findCommonAvailableSlots(requestId: string): Promise<string[]> {
    const request = await this.prisma.meetingRequest.findUnique({
      where: { id: requestId },
      select: { durationMinutes: true },
    });

    if (!request) {
      throw new NotFoundException('Meeting request not found');
    }

    const durationMinutes = request.durationMinutes;
    const slotsPerDuration = durationMinutes / 30;

    const slots = await this.prisma.timeSlot.findMany({
      where: {
        requestId,
        status: SlotStatus.AVAILABLE,
      },
      orderBy: { slotDate: 'asc' },
    });

    const participants = await this.prisma.participant.findMany({
      where: { requestId },
      select: { id: true },
    });

    const totalParticipants = participants.length;
    const slotCount: Record<string, number> = {};

    for (const slot of slots) {
      const key = slot.slotDate.toISOString();
      slotCount[key] = (slotCount[key] || 0) + 1;
    }

    const commonSlots = Object.entries(slotCount)
      .filter(([, count]) => count === totalParticipants)
      .map(([key]) => new Date(key).getTime())
      .sort((a, b) => a - b);

    const validSlots: string[] = [];
    let consecutiveCount = 0;
    const slotInterval = 30 * 60 * 1000;

    for (let i = 0; i < commonSlots.length; i++) {
      if (i > 0 && commonSlots[i] - commonSlots[i - 1] === slotInterval) {
        consecutiveCount++;
      } else {
        consecutiveCount = 1;
      }

      if (consecutiveCount >= slotsPerDuration) {
        const startSlot = commonSlots[i - slotsPerDuration + 1];
        validSlots.push(new Date(startSlot).toISOString());
      }
    }

    return validSlots;
  }

  private parseSlotDates(available: string[], unavailable: string[]) {
    return {
      available: available.map((s) => new Date(s).toISOString()),
      unavailable: unavailable.map((s) => new Date(s).toISOString()),
    };
  }

  private getSlotId(requestId: string, participantId: string, slotDate: string): string {
    return `${requestId}-${participantId}-${slotDate}`;
  }
}
