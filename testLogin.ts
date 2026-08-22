import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const prisma = new PrismaClient();

const secretKey = process.env.JWT_SECRET || "dayflow_odoo_hackathon_super_secret_jwt_key_2026_employa_minimum_32_chars";
const key = new TextEncoder().encode(secretKey);

async function testLogin() {
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: 'admin@dayflow.com' },
          { loginId: 'admin@dayflow.com' }
        ]
      }
    });

    if (!user) {
      console.log('No user');
      return;
    }
    console.log('User found:', user.email);

    if (user.emailVerified === null) {
      console.log('Not verified');
      return;
    }

    const isValid = await bcrypt.compare('AdminPassword123!', user.password);
    console.log('Password valid:', isValid);

    // Try creating token
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const payload = {
      id: user.id,
      role: user.role,
      loginId: user.loginId,
      isFirstLogin: user.isFirstLogin,
      expires
    };

    const session = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(key);
    
    console.log('Token created successfully!');
  } catch (err) {
    console.error('Error during login:', err);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
