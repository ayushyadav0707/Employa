import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkAdmin() {
  const user = await prisma.user.findUnique({ where: { email: 'admin@dayflow.com' } });
  console.log(user);
  if (user) {
    const isValid = await bcrypt.compare('AdminPassword123!', user.password);
    console.log('Password valid:', isValid);
  }
}
checkAdmin().finally(() => prisma.$disconnect());
