import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'dayflow_odoo_hackathon_super_secret_jwt_key_2026';

export interface JwtUserPayload {
  id: string;          // Employee ID e.g. "EMP001"
  name: string;        // e.g. "John Doe"
  email: string;       // e.g. "john@dayflow.com"
  role: 'Employee' | 'Admin' | 'HR';
  department: string;  // e.g. "Engineering"
}

export function signJwt(payload: JwtUserPayload, expiresIn = '7d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

export function verifyJwt(token: string): JwtUserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtUserPayload;
  } catch {
    return null;
  }
}

export function getSessionUser(request: NextRequest): JwtUserPayload | null {
  // 1. Check Authorization Bearer header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const verified = verifyJwt(token);
    if (verified) return verified;
  }

  // 2. Check cookie
  const cookieToken = request.cookies.get('dayflow_auth_token')?.value;
  if (cookieToken) {
    const verified = verifyJwt(cookieToken);
    if (verified) return verified;
  }

  // 3. Fallback demo header for testing (x-user-id, x-user-role)
  const demoUserId = request.headers.get('x-user-id');
  const demoRole = request.headers.get('x-user-role') as ('Employee' | 'Admin' | 'HR') | null;
  if (demoUserId) {
    return {
      id: demoUserId,
      name: 'Session User',
      email: `${demoUserId.toLowerCase()}@dayflow.com`,
      role: demoRole || 'Employee',
      department: 'Engineering'
    };
  }

  return null;
}
