import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.meetingRequest.create({
    data: {
      title: '테스트 회의',
      organizerId: 'user-1',
      status: 'OPEN',
      startDate: new Date('2026-01-20'),
      endDate: new Date('2026-01-21'),
      durationMinutes: 60,
      participants: {
        create: [
          { userId: 'user-1', name: '김철수' },
          { userId: 'user-2', name: '이영희' },
          { userId: 'user-3', name: '박지민' },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
