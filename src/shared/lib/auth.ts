import { Pool } from 'pg';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

import { betterAuth } from 'better-auth';
import { PrismaPg } from '@prisma/adapter-pg';
import { admin, multiSession } from 'better-auth/plugins';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '../../../prisma/generated/client';
import { sendVerificationEmail } from './send-verification-email';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  baseURL: process.env.BACKEND_URL || 'http://localhost:7777',
  basePath: '/auth',
  trustedOrigins: [...(process.env.TRUSTED_ORIGINS || '').split(',')],
  plugins: [admin(), multiSession()],
  emailAndPassword: { enabled: true, requireEmailVerification: true },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({ email: user.email, url }, 'verification');
    },
  },

  user: {
    // Перевірити чи правильно так включати зміну емайла
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async (data, request) => {
        await sendVerificationEmail(
          { email: data.newEmail, url: data.url },
          'change-email',
        );
      },
    },

    emailVerification: {
      // Required to send the verification email
      // sendVerificationEmail: async ({ user, url, token }) => {
      //   void sendEmail({
      //     to: user.email,
      //   });
      // },
      sendVerificationEmail: async ({ user, url }) => {
        await sendVerificationEmail({ email: user.email, url }, 'verification');
      },
    },

    additionalFields: {
      birthDate: { type: 'date' },
      phone: { type: 'string' },
      region_city: { type: 'string' },
      education: { type: 'string' },
      specialty: { type: 'string' },
      workplace: { type: 'string' },
      jobTitle: { type: 'string' },
    },

    deleteUser: {
      enabled: true,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 14,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: false,
      // enabled: true,
      // maxAge: 5 * 60,
    },
  },

  socialProviders: {},

  secret: process.env.BETTER_AUTH_SECRET!,

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
