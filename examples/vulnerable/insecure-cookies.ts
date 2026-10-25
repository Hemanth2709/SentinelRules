// VULNERABLE EXAMPLE - do not copy into production code.

import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';

declare const authService: { login(body: unknown): Promise<string> };

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() body: unknown, @Res({ passthrough: true }) res: Response) {
    const sessionToken = await authService.login(body);
    // Readable by document.cookie (no HttpOnly), sent over HTTP (no Secure),
    // SameSite left to browser defaults.
    res.cookie('session_token', sessionToken);
    return { ok: true };
  }
}
