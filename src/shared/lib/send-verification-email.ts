import { getEmailTemplate } from './get-email-template';

const nodemailer = require('nodemailer');

export const sendVerificationEmail = async (
  { email, url },
  type: 'verification' | 'change-email' = 'verification',
) => {
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
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const emailSubject =
    type === 'verification'
      ? 'Підтвердження електронної пошти'
      : 'Зміна електронної пошти';

  const message = {
    from: 'support@pharm.zt.ua',
    to: email,
    subject: `${emailSubject} — БПР ЖБФФК`,
    html: getEmailTemplate(finalUrl, type),
  };

  await transport.sendMail(message, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      // console.log(info);
    }
  });
};
