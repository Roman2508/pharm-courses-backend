import * as path from 'path';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

import { betterAuth } from 'better-auth';
import { PrismaPg } from '@prisma/adapter-pg';
import { admin, multiSession } from 'better-auth/plugins';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '../../../prisma/generated/client';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:7777',
  basePath: '/auth',
  trustedOrigins: [...(process.env.TRUSTED_ORIGINS || '').split(',')],
  emailAndPassword: { enabled: true },
  plugins: [admin(), multiSession()],
  user: {
    additionalFields: {
      phone: { type: 'string' },
      region_city: { type: 'string' },
      education: { type: 'string' },
      specialty: { type: 'string' },
      workplace: { type: 'string' },
      jobTitle: { type: 'string' },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 14,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  socialProviders: {},

  secret: process.env.BETTER_AUTH_SECRET || 'your-secret-key-change-this',

  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production',
    cookiePrefix: 'pharm-courses',
    generateSessionToken: true,
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      path: '/',
    },
  },
});
