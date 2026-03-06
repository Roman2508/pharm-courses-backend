import { Pool } from 'pg';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

import { i18n } from '@better-auth/i18n';
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
  plugins: [
    admin(),
    multiSession(),
    i18n({
      defaultLocale: 'uk',
      translations: {
        uk: {
          USER_NOT_FOUND: 'Користувача не знайдено',
          INVALID_EMAIL_OR_PASSWORD: 'Невірна електронна пошта або пароль',
          INVALID_PASSWORD: 'Невірний пароль',
          EMAIL_ALREADY_VERIFIED: 'Електронна пошта вже верифікована',
          EMAIL_NOT_VERIFIED: 'Електронну пошту не підтверджено',
          CREDENTIAL_ACCOUNT_NOT_FOUND: 'Обліковий запис не знайдено',
          SESSION_EXPIRED: 'Сеанс закінчився',
          ACCESS_DENIED: 'Доступ заборонено',
        },
      },
    }),
  ],
  emailAndPassword: { enabled: true, requireEmailVerification: true },

  // Уніфікована верифікація пошти
  emailVerification: {
    sendOnSignIn: false,
    sendVerificationEmail: async ({ user, url }) => {
      // Якщо користувач вже верифікований (emailVerified: true), то це зміна пошти.
      // Якщо ні - це первинна реєстрація.
      const type = user.emailVerified ? 'change-email' : 'verification';

      await sendVerificationEmail({ email: user.email, url }, type);
    },
  },

  user: {
    changeEmail: {
      enabled: true,
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
