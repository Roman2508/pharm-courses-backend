import { Pool } from 'pg';
import * as path from 'path';
import * as dotenv from 'dotenv';
const nodemailer = require('nodemailer');

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

import { betterAuth } from 'better-auth';
import { PrismaPg } from '@prisma/adapter-pg';
import { getEmailTemplate } from './get-email-template';
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
  baseURL: process.env.BACKEND_URL || 'http://localhost:7777',
  basePath: '/auth',
  trustedOrigins: [...(process.env.TRUSTED_ORIGINS || '').split(',')],
  plugins: [admin(), multiSession()],
  emailAndPassword: { enabled: true, requireEmailVerification: true },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const origins = (process.env.TRUSTED_ORIGINS || '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);

      const FRONTEND_URL = origins[0];
      const tokenUrl = new URL(url);
      tokenUrl.searchParams.set('callbackURL', `${FRONTEND_URL}/auth/verified`);
      const finalUrl = tokenUrl.toString();

      let transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '465'),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
      const message = {
        from: 'support@pharm.zt.ua',
        to: user.email,
        // to: 'ptashnyk.roman@pharm.zt.ua',
        subject: 'Підтвердження електронної пошти — Курси БПР ЖБФФК',
        html: getEmailTemplate(finalUrl),
      };

      await transport.sendMail(message, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          // console.log(info);
        }
      });
    },
  },

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

// import { Resend } from 'resend';

// const resend = new Resend(process.env.RESEND_API_KEY);

// sendVerificationEmail: async ({ user, url }) => {
//   const origins = (process.env.TRUSTED_ORIGINS || '')
//     .split(',')
//     .map((origin) => origin.trim())
//     .filter(Boolean);

//   const FRONTEND_URL = origins[0];
//   const tokenUrl = new URL(url);
//   tokenUrl.searchParams.set('callbackURL', `${FRONTEND_URL}/auth/verified`);
//   const finalUrl = tokenUrl.toString();

//   await resend.emails.send({
//     from: 'onboarding@resend.dev',
//     // from: 'Курси БПР <noreply@pharm.zt.ua>',
//     to: user.email,
//     subject: 'Підтвердження електронної пошти — курси БПР ЖБФФК',
//     html: `
//     <h1>Вітаємо!</h1>

//     <p>Ви отримали цей лист, оскільки реєструвалися на платформі курсів безперервного професійного розвитку (БПР)
//     Житомирського базового фармацевтичного фахового коледжу.</p>

//     <p>Щоб завершити реєстрацію та підтвердити свою електронну пошту, будь ласка, перейдіть за посиланням нижче:</p>

//     <p><a href="${finalUrl}">[Підтвердити електронну пошту]</a></p>

//     <p>Якщо ви не реєструвалися на нашому сайті, просто проігноруйте цей лист.</p>

//     <p>З повагою</p>
//     <p>Житомирський базовий фармацевтичний фаховий коледж</p>
//     `,
//   });
// },
