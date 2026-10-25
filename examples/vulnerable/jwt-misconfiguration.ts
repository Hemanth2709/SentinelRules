// VULNERABLE EXAMPLE - do not copy into production code.

import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Expired tokens are accepted forever.
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  validate(payload: { sub: string }) {
    return { userId: payload.sub };
  }
}

// No algorithm allowlist: the token header chooses the algorithm family.
export function verifyWebhookToken(token: string) {
  return jwt.verify(token, process.env.WEBHOOK_PUBLIC_KEY as string);
}
