import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.user.groupBy({
    by: ['employmentType'],
    where: { status: { not: 'TERMINATED' } },
    _count: { employmentType: true },
  });

  console.log('\n=== Raw Employment Type Counts ===');
  let total = 0;
  for (const row of rows) {
    console.log(`  ${row.employmentType}: ${row._count.employmentType}`);
    total += row._count.employmentType;
  }
  console.log(`  TOTAL: ${total}`);
  console.log('\nPercentages (as displayed in chart):');
  for (const row of rows) {
    const pct = Math.round((row._count.employmentType / total) * 100);
    console.log(`  ${row.employmentType}: ${row._count.employmentType}/${total} = ${pct}%`);
  }
  console.log(`  Sum check: ${rows.reduce((s, r) => s + Math.round((r._count.employmentType / total) * 100), 0)}% (rounding may not sum to exactly 100)`);

  // Also show all users and their type for full transparency
  const users = await prisma.user.findMany({
    where: { status: { not: 'TERMINATED' } },
    select: { name: true, loginId: true, employmentType: true, companyName: true },
    orderBy: { createdAt: 'asc' },
  });
  console.log('\n=== Every user and their employmentType ===');
  for (const u of users) {
    console.log(`  ${u.loginId.padEnd(20)} ${u.employmentType.padEnd(12)} ${u.name}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
