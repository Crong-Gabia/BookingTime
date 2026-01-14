# 백엔드: 응답 마감일 (Response Deadline)

## 개요

회의 요청에 응답 마감일을 옵션으로 설정 가능하게 하고, 마감일이 지나면 응답/리마인드 요청을 차단하는 기능 구현.

## 데이터베이스

### 모델 변경

**파일**: `apps/api/prisma/schema.prisma`

```prisma
model MeetingRequest {
  // ... 기존 필드
  version           Int              @default(1)
  closedAt          DateTime?
+ responseDeadlineAt DateTime?  // ✨ 추가
  createdAt         DateTime         @default(now())
}
```

**설명**: `responseDeadlineAt`은 nullable 필드로, 기본값 없음(없음)을 의미한다.

### 마이그레이션

**파일**: `apps/api/prisma/migrations/20260114141246_add_response_deadline_at/migration.sql`

```sql
ALTER TABLE "public"."MeetingRequest" ADD COLUMN "responseDeadlineAt" TIMESTAMP(3);
```

**실행**: `pnpm prisma migrate dev --name add-response_deadline_at`

## DTO

### CreateMeetingRequestDto

**파일**: `packages/shared/src/dto.ts`

```typescript
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
  organizerAvailableSlots?: string[];
+ responseDeadlineAt?: string | null;  // ✨ 추가
}
```

### DashboardDto

**파일**: `packages/shared/src/dto.ts`

```typescript
export interface DashboardDto {
  requestId: string;
  title: string;
  description?: string;
  status: MeetingRequestStatus;
  participants: Array<{
    userId: string;
    name: string;
    responded: boolean;
  }>;
  commonAvailableSlots: Array<{
    date: string;
    times: string[];
  }>;
  organizerAvailableSlots?: string[];
  createdAt: string;
  startDate: string;
  endDate: string;
  durationMinutes: number;
+ responseDeadlineAt?: string | null;  // ✨ 추가
}
```

## API 로직

### MeetingService.createRequest

**파일**: `apps/api/src/modules/meeting/meeting.service.ts`

**변경사항**:

```typescript
async createRequest(dto: CreateMeetingRequestDto): Promise<CreateMeetingResponseDto> {
  // ... 기존 유효성 검사

+ // ✨ 마감일 유효성 검사
+ const responseDeadlineAt = dto.responseDeadlineAt ? new Date(dto.responseDeadlineAt) : null;
+ if (dto.responseDeadlineAt && Number.isNaN(responseDeadlineAt?.getTime())) {
+   throw new BadRequestException('Invalid response deadline');
+ }

  const request = await this.prisma.meetingRequest.create({
    data: {
      title: dto.title,
      organizerId: dto.organizerId,
      startDate,
      endDate,
      durationMinutes: dto.durationMinutes,
      location: dto.location,
      status: MeetingStatus.OPEN,
+     responseDeadlineAt: responseDeadlineAt ?? undefined,  // ✨ 저장
      participants: {
        create: dto.participantIds.map((userId) => ({
          userId,
          name: this.hrAdapter.getUserName(userId),
        })),
      },
    },
  });

  return {
    // ...
    createdAt: request.createdAt.toISOString(),
+   responseDeadlineAt: request.responseDeadlineAt?.toISOString() ?? null,  // ✨ 응답 포함
  };
}
```

### MeetingService.getDashboard

**변경사항**:

```typescript
return {
  requestId: request.id,
  title: request.title,
  status: request.status as MeetingRequestStatus,
  participants: request.participants.map((p) => ({
    userId: p.userId,
    name: p.name,
    responded: p.responded,
  })),
  commonAvailableSlots,
  organizerAvailableSlots: organizerSlots.map((s) => s.slotDate.toISOString()),
  createdAt: request.createdAt.toISOString(),
  startDate: request.startDate.toISOString(),
  endDate: request.endDate.toISOString(),
  durationMinutes: request.durationMinutes,
+ responseDeadlineAt: request.responseDeadlineAt?.toISOString() ?? null,  // ✨ 응답 포함
};
```

### MeetingService.createResponse

**변경사항**:

```typescript
async createResponse(requestId: string, dto: CreateResponseDto) {
  await this.prisma.$transaction(async (tx) => {
    const request = await tx.meetingRequest.findUnique({
      where: { id: requestId },
      select: { status: true, closedAt: true, responseDeadlineAt: true },
    });

    if (!request) {
      throw new NotFoundException('Meeting request not found');
    }

    // ✨ 기존 종료 조건 (CONFIRMED/closedAt)
    if (request.status === MeetingStatus.CONFIRMED || request.closedAt) {
      throw new BadRequestException(ERROR_CODES.REQUEST_CLOSED, 'Request is closed');
    }

+   // ✨ 마감일 경과 체크
+   if (request.responseDeadlineAt && new Date() >= request.responseDeadlineAt) {
+     throw new BadRequestException(ERROR_CODES.REQUEST_CLOSED, 'Request is closed');
+   }

    const participant = await tx.participant.findFirst({
      where: { requestId, userId: dto.userId },
    });

    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    // ... 나머지 로직
  });
}
```

### MeetingService.remindParticipant

**변경사항**:

```typescript
async remindParticipant(requestId: string, userId: string): Promise<RemindResponseDto> {
+ // ✨ 마감일 체크 (리마인드 전송 전)
+ const request = await this.prisma.meetingRequest.findUnique({
+   where: { id: requestId },
+   select: { status: true, closedAt: true, responseDeadlineAt: true },
+ });

+ if (!request) {
+   throw new NotFoundException('Meeting request not found');
+ }

+ if (request.status === MeetingStatus.CONFIRMED || request.closedAt) {
+   throw new BadRequestException(ERROR_CODES.REQUEST_CLOSED, 'Request is closed');
+ }

+ if (request.responseDeadlineAt && new Date() >= request.responseDeadlineAt) {
+   throw new BadRequestException(ERROR_CODES.REQUEST_CLOSED, 'Request is closed');
+ }

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
```

### 기타 수정

**updateOrganizerAvailability**

```typescript
- // ✨ 불필요한 $transaction 제거
- await this.prisma.$transaction(async (tx) => {
-   await tx.timeSlot.updateMany({ ... });
- });

+ await this.prisma.timeSlot.updateMany({ ... });
```

## 테스트

### MeetingService Spec 업데이트

**파일**: `apps/api/src/modules/meeting/meeting.service.spec.ts`

**변경사항**:

```typescript
// ✨ createMany mock 추가
timeSlot: {
  upsert: jest.fn(),
  create: jest.fn(),
+ createMany: jest.fn(),  // ✨ 추가
  updateMany: jest.fn(),
  findMany: jest.fn(),
}

// ✨ 슬롯 교집합 테스트 수정
it('모든 참가자가 가능한 시간을 찾는다', async () => {
+ const mockRequest = {
+   id: 'test-id',
+   title: 'Test Meeting',
+   // ...
+ };
+ (prisma.meetingRequest.findUnique as jest.Mock).mockResolvedValue(mockRequest);

  for (const { slots1, slots2, expected } of cases) {
    // ...
    const result = await service.getDashboard('test-id');
+   const totalTimes = result.commonAvailableSlots.flatMap((slot) => slot.times).length;
+   expect(totalTimes).toBe(expected.length);
  }
});

// ✨ 주최자 시간 업데이트 테스트 수정
it('주최자 시간 업데이트', async () => {
+ const createdRequest = { /* ... */ };
+ (prisma.meetingRequest.create as jest.Mock).mockResolvedValue(createdRequest);
+ (prisma.timeSlot.createMany as jest.Mock).mockResolvedValue({ count: 48 });

  await service.createRequest(dto);

+ expect(prisma.meetingRequest.create).toHaveBeenCalled();

  const mockRequest = { id: '1', status: 'OPEN', version: 1, closedAt: null };
  (prisma.meetingRequest.findUnique as jest.Mock).mockResolvedValue(mockRequest);
});

// ✨ IHrAdapter.getUserName을 async로 변경
class HrAdapterMock implements IHrAdapter {
- getUserName(userId: string): string {
+ async getUserName(_userId: string): Promise<string> {
    return 'Test User';
  }
}
```

## 검증

```bash
✅ pnpm --filter api build
✅ pnpm --filter api test (6/6 passed)
```

## 정책

- **기본값**: 없음 (null)
- **마감일이 없으면**: 응답 계속 가능
- **마감일이 있으면**: 해당 시각 이후 응답/리마인드 차단 (`REQUEST_CLOSED`)
- **종료 조건**:
  1. `CONFIRMED` (주최자가 수동으로 확정)
  2. `closedAt` (명시적 종료)
  3. `responseDeadlineAt >= now` (마감일 경과)
