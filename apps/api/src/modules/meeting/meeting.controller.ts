import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import {
  CreateMeetingRequestDto,
  CreateMeetingResponseDto,
  CreateParticipantResponseDto,
  DashboardDto,
  ConfirmMeetingDto,
  ConfirmMeetingResponseDto,
  RemindResponseDto,
} from 'shared';

@Controller('meetings')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Get()
  async getAll(): Promise<{ meetings: Array<{ id: string; title: string; status: string; responseRate: number; createdAt: string }> }> {
    return this.meetingService.getAllMeetings();
  }

  @Post()
  async create(
    @Body() dto: CreateMeetingRequestDto,
  ): Promise<CreateMeetingResponseDto> {
    return this.meetingService.createRequest(dto);
  }

  @Get(':id/dashboard')
  async getDashboard(@Param('id') id: string): Promise<DashboardDto> {
    return this.meetingService.getDashboard(id);
  }

  @Post(':id/respond')
  async respond(
    @Param('id') id: string,
    @Body() dto: CreateParticipantResponseDto,
  ): Promise<void> {
    return this.meetingService.createResponse(id, dto);
  }

  @Post(':id/remind/:userId')
  async remind(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ): Promise<RemindResponseDto> {
    return this.meetingService.remindParticipant(id, userId);
  }

  @Post(':id/confirm')
  async confirm(
    @Body() dto: ConfirmMeetingDto,
  ): Promise<ConfirmMeetingResponseDto> {
    return this.meetingService.confirmMeeting(dto);
  }
}
