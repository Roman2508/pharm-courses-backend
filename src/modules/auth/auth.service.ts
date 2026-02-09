import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async checkVerification(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { emailVerified: true },
    });

    return !!user?.emailVerified;
  }
}
