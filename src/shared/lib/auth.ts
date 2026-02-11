import * as path from 'path';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { Resend } from 'resend';
const nodemailer = require('nodemailer');

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

import { betterAuth } from 'better-auth';
import { PrismaPg } from '@prisma/adapter-pg';
import { admin, multiSession } from 'better-auth/plugins';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '../../../prisma/generated/client';

const resend = new Resend(process.env.RESEND_API_KEY);

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
        // to: user.email,
        to: 'ptashnyk.roman@pharm.zt.ua',
        subject: 'Design Your Model S | Tesla',
        // text: 'Have the most fun you can in a car. Get your Tesla today!',
        html: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  lang="uk"
>
  <head>
    <title></title>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <!--[if !mso]>-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!--<![endif]-->
    <meta name="x-apple-disable-message-reformatting" content="" />
    <meta content="target-densitydpi=device-dpi" name="viewport" />
    <meta content="true" name="HandheldFriendly" />
    <meta content="width=device-width" name="viewport" />
    <meta
      name="format-detection"
      content="telephone=no, date=no, address=no, email=no, url=no"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@500;600;700&amp;display=swap"
      rel="stylesheet"
      type="text/css"
    />
    <style type="text/css">
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Fira Sans', BlinkMacSystemFont, Segoe UI, Helvetica Neue,
          Arial, sans-serif;
      }
      body {
        min-width: 100%;
        background-color: #f0f0f0;
      }

      p {
        margin-bottom: 8px;
        color: #666666;
        font-size: 16px;
        line-height: 1.5em;
        /* line-height: 22px; */
        text-align: justify;
      }

      button {
        background-color: #0055ff;
        color: #ffffff;
        padding: 16px 32px;
        border-radius: 10px;
        font-size: 18px;
        text-decoration: none;
        border: 0;
        cursor: pointer;
      }
    </style>
  </head>
  <body style="background-color: #f0f0f0; min-width: 100%; margin: 20px 0">
    <div
      style="
        width: 100%;
        max-width: 650px;
        margin: 20px auto;
        padding: 40px 20px;
        background-color: #ffffff;
      "
    >
      <div style="text-align: center">
        <img src="./logo.png" alt="" style="width: 120px; height: auto" />
      </div>

      <h1 style="font-size: 32px; margin: 30px 0; text-align: center">
        Вітаємо! Ви зареєструвалися в системі курсів БПР.
      </h1>

      <p>
        Ви отримали цей лист, оскільки реєструвалися на платформі курсів
        безперервного професійного розвитку (БПР) Житомирського базового
        фармацевтичного фахового коледжу.
      </p>
      <p>
        Щоб завершити реєстрацію та підтвердити свою електронну пошту, будь
        ласка, перейдіть за посиланням нижче:
      </p>
      <p>
        Якщо ви не реєструвалися на нашому сайті, просто проігноруйте цей лист.
      </p>
      <p>З повагою</p>
      <p>Житомирський базовий фармацевтичний фаховий коледж</p>

      <div style="text-align: center; margin: 32px 0">
        <a href="${finalUrl}">
          <button>Підтвердити електронну пошту</button>
        </a>
      </div>
    </div>
  </body>
</html>`,
      };

      await transport.sendMail(message, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      });
    },

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

// export const sendNodemailer = () => {
//   let transport = nodemailer.createTransport({
//     host: 'email.pharm.zt.ua',
//     port: 465,
//     auth: {
//       user: 'support@pharm.zt.ua',
//       pass: 'Wj5RqqSY8hNj5mP=',
//     },
//   });
//   const message = {
//     from: 'support@pharm.zt.ua', // Sender address
//     to: 'ptashnyk.roman@pharm.zt.ua', // List of recipients
//     subject: 'Design Your Model S | Tesla', // Subject line
//     text: 'Have the most fun you can in a car. Get your Tesla today!', // Plain text body
//   };
//   transport.sendMail(message, function (err, info) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(info);
//     }
//   });
// };
