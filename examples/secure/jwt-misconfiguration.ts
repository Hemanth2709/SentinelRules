// SECURE EXAMPLE

import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Expiration is enforced (this is also the default when omitted).
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      algorithms: ['HS256'],
      issuer: 'https://auth.example.com',
      audience: 'api.example.com',
    });
  }

  validate(payload: { sub: string }) {
    return { userId: payload.sub };
  }
}

export function verifyWebhookToken(token: string) {
  return jwt.verify(token, process.env.WEBHOOK_PUBLIC_KEY as string, {
    algorithms: ['RS256'],
    issuer: 'https://webhooks.example.com',
    maxAge: '5m',
  });
}
