import path from 'path';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { betterAuth } from 'better-auth';
import { PrismaPg } from '@prisma/adapter-pg';
import { admin, multiSession } from 'better-auth/plugins';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import { PrismaClient } from '../../../prisma/generated/client';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:7777',
  basePath: '/auth',
  trustedOrigins: ['http://localhost:5173'],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [admin(), multiSession()],
});
