export enum MeetingRequestStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
}

export enum TimeSlotStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  BLOCKED = 'BLOCKED',
}

export interface CreateMeetingRequestDto {
  title: string;
  description?: string;
  organizerId: string;
  participantIds: string[];
  requiredParticipantIds: string[];
  startDate: string;
  endDate: string;
  durationMinutes: number;
  location?: string;
}

export interface CreateMeetingResponseDto {
  id: string;
  title: string;
  organizerId: string;
  status: MeetingRequestStatus;
  startDate: string;
  endDate: string;
  durationMinutes: number;
  createdAt: string;
}

export interface CreateParticipantResponseDto {
  userId: string;
  name: string;
  availableSlots: string[];
  unavailableSlots: string[];
  notes?: string;
}

export interface DashboardDto {
  requestId: string;
  title: string;
  description?: string;
  status: MeetingRequestStatus;
  participants: Array<{
    userId: string;
    name: string;
    department: string;
    responded: boolean;
  }>;
  commonAvailableSlots: Array<{
    date: string;
    times: string[];
  }>;
  createdAt: string;
  startDate: string;
  endDate: string;
  durationMinutes: number;
}

export interface CreateMeetingResponse {
  requestId: string;
  meetingUrl: string;
  responseUrl: string;
}

export interface RemindResponseDto {
  userId: string;
  sent: boolean;
}

export interface ConfirmMeetingDto {
  requestId: string;
  selectedTimeSlot: string;
  location: string;
}

export interface ConfirmMeetingResponseDto {
  id: string;
  requestId: string;
  selectedTimeSlot: string;
  location?: string;
  confirmedAt: string;
}

export interface SubmitResponseDto {
  requestId: string;
  userId: string;
  name: string;
  availableSlots: string[];
  unavailableSlots: string[];
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
}

export interface ErrorResponse {
  code: string;
  message: string;
  timestamp: string;
}

export const ERROR_CODES = {
  ROOM_TAKEN: 'ROOM_TAKEN',
  VERSION_MISMATCH: 'VERSION_MISMATCH',
  REQUEST_CLOSED: 'REQUEST_CLOSED',
  INVALID_TIME_RANGE: 'INVALID_TIME_RANGE',
  NO_COMMON_SLOTS: 'NO_COMMON_SLOTS',
  PARTICIPANT_NOT_FOUND: 'PARTICIPANT_NOT_FOUND',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];
