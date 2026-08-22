import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Master Admin Account...');

  const masterEmail = 'admin@dayflow.com';
  const masterPassword = 'AdminPassword123!';

  // Check if it already exists to prevent duplicate key errors on multiple runs
  const existingAdmin = await prisma.user.findUnique({
    where: { email: masterEmail },
  });

  if (existingAdmin) {
    console.log(`✅ Master admin already exists! (Login ID: ${existingAdmin.loginId})`);
    return;
  }

  const hashedPassword = await bcrypt.hash(masterPassword, 10);
  
  // Custom Login ID for Master
  const loginId = 'DAYFLOWMASTER01';

  const admin = await prisma.user.create({
    data: {
      companyName: 'Dayflow Inc',
      name: 'Master Admin',
      email: masterEmail,
      phone: '1234567890',
      loginId: loginId,
      password: hashedPassword,
      role: 'ADMIN',
      isFirstLogin: false,
      emailVerified: new Date(),
    },
  });

  console.log('✅ Master Admin Seeded Successfully!');
  console.log('-------------------------------------------');
  console.log(`Login ID: ${admin.loginId}`);
  console.log(`Email:    ${admin.email}`);
  console.log(`Password: ${masterPassword}`);
  console.log('-------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Failed to seed database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
