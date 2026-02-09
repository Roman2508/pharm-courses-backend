import { toNodeHandler } from 'better-auth/node';
import type { Request, Response } from 'express';
import { Req, Res, Controller, All, Get, Query } from '@nestjs/common';

import { auth } from 'src/shared/lib/auth';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('verification-status')
  async checkVerification(@Query('email') email: string) {
    return this.authService.checkVerification(email);
  }

  @All('*path')
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    return toNodeHandler(auth)(req, res);
  }
}
