// SECURE EXAMPLE

import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';

declare const authService: { login(body: unknown): Promise<string> };

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() body: unknown, @Res({ passthrough: true }) res: Response) {
    const sessionToken = await authService.login(body);
    res.cookie('session_token', sessionToken, {
      httpOnly: true, // not readable from JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS only when deployed
      sameSite: 'lax', // not sent on cross-site subresource requests / POSTs
      path: '/',
      maxAge: 60 * 60 * 1000,
    });
    return { ok: true };
  }
}
