// Test fixtures for rules/jwt-misconfiguration.yml

import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

declare const token: string;
declare const publicKey: string;
declare const options: jwt.VerifyOptions;

// ---------------------------------------------------------------------------
// sentinel-jwt-ignore-expiration
// ---------------------------------------------------------------------------

@Injectable()
export class LegacyJwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ruleid: sentinel-jwt-ignore-expiration
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
}

export const legacyJwtModule = JwtModule.register({
  secret: process.env.JWT_SECRET,
  // ruleid: sentinel-jwt-ignore-expiration
  verifyOptions: { algorithms: ['HS256'], ignoreExpiration: true },
});

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // ok: sentinel-jwt-ignore-expiration
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      algorithms: ['HS256'],
    });
  }
}

// ok: sentinel-jwt-ignore-expiration
export const jwtModule = JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '15m' },
  verifyOptions: { algorithms: ['HS256'], issuer: 'https://auth.example.com' },
});

// ---------------------------------------------------------------------------
// sentinel-jwt-verify-missing-algorithms
// ---------------------------------------------------------------------------

export function verifyWithoutOptions() {
  // ruleid: sentinel-jwt-verify-missing-algorithms
  return jwt.verify(token, publicKey);
}

export function verifyWithOptionsButNoAlgorithms() {
  // ruleid: sentinel-jwt-verify-missing-algorithms
  return jwt.verify(token, publicKey, { audience: 'api', issuer: 'https://auth.example.com' });
}

export function verifyWithCallbackOnly() {
  // ruleid: sentinel-jwt-verify-missing-algorithms
  jwt.verify(token, publicKey, (err, decoded) => console.log(err, decoded));
}

export function verifyWithPinnedAlgorithm() {
  // ok: sentinel-jwt-verify-missing-algorithms
  return jwt.verify(token, publicKey, { algorithms: ['RS256'], audience: 'api' });
}

export function verifyWithPinnedAlgorithmAndCallback() {
  // ok: sentinel-jwt-verify-missing-algorithms
  jwt.verify(token, publicKey, { algorithms: ['ES256'] }, (err, decoded) => console.log(err, decoded));
}

export function verifyWithSharedOptionsObject() {
  // Options defined elsewhere cannot be inspected; not reported.
  // ok: sentinel-jwt-verify-missing-algorithms
  return jwt.verify(token, publicKey, options);
}

export function verifyWithSpreadOptions() {
  // A spread may provide algorithms; cannot be inspected, not reported.
  // ok: sentinel-jwt-verify-missing-algorithms
  return jwt.verify(token, publicKey, { ...options, audience: 'api' });
}

export function unrelatedVerifyMethod(signer: { verify: (a: string, b: string) => boolean }) {
  // ok: sentinel-jwt-verify-missing-algorithms
  return signer.verify(token, publicKey);
}

export function verifyViaRequire() {
  // CommonJS import form.
  const jsonwebtoken = require('jsonwebtoken');
  // ruleid: sentinel-jwt-verify-missing-algorithms
  return jsonwebtoken.verify(token, publicKey, { complete: true });
}
