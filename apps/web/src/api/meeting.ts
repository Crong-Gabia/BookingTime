export async function fetchDashboard(requestId: string) {
  const response = await fetch(`/api/meetings/${requestId}/dashboard`);
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard');
  }
  return response.json();
}

export async function createMeeting(payload: {
  title: string;
  description?: string;
  durationMinutes: number;
  startDate: string;
  endDate: string;
  participantIds: string[];
  organizerId: string;
}) {
  const response = await fetch('/api/meetings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('Failed to create meeting');
  }
  return response.json();
}

export async function submitResponse(payload: {
  requestId: string;
  userId: string;
  name: string;
  availableSlots: string[];
  unavailableSlots: string[];
}) {
  const response = await fetch(`/api/meetings/${payload.requestId}/respond`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('Failed to submit response');
  }
  return response.json();
}

export async function sendReminder(requestId: string, userId: string) {
  const response = await fetch(`/api/meetings/${requestId}/remind/${userId}`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to send reminder');
  }
  return response.json();
}

export async function confirmMeeting(payload: {
  requestId: string;
  confirmedStart: string;
  confirmedEnd: string;
  roomId: string;
}) {
  const response = await fetch('/api/meetings/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('Failed to confirm meeting');
  }
  return response.json();
}

export type DashboardData = {
  requestId: string;
  title: string;
  description?: string;
  status: string;
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
};

export type CreateMeetingRequestDto = {
  title: string;
  description?: string;
  durationMinutes: number;
  startDate: string;
  endDate: string;
  participantIds: string[];
  organizerId: string;
};

export type SubmitResponseDto = {
  requestId: string;
  userId: string;
  name: string;
  availableSlots: string[];
  unavailableSlots: string[];
};

export type ConfirmMeetingDto = {
  requestId: string;
  confirmedStart: string;
  confirmedEnd: string;
  roomId: string;
};

export type CreateMeetingResponse = {
  requestId: string;
  meetingUrl: string;
  responseUrl: string;
};
