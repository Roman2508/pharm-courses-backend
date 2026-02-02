import { toNodeHandler } from 'better-auth/node';
import type { Request, Response } from 'express';
import { Req, Res, Controller, All } from '@nestjs/common';

import { auth } from 'src/shared/lib/auth';

@Controller('auth')
export class AuthController {
  @All('*path')
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    return toNodeHandler(auth)(req, res);
  }
}
