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

// ---------------------------------------------------------------------------
// sentinel-jwt-decode-without-verify (v0.3.0)
// ---------------------------------------------------------------------------

// Benchmark V-06: decode() trusts the claims of any forged token.
export function userIdFromToken(token: string): string {
  // ruleid: sentinel-jwt-decode-without-verify
  const claims = jwt.decode(token) as { sub?: string } | null;
  if (!claims?.sub) throw new Error('unauthorized');
  return claims.sub;
}

export class SessionReader {
  read(token: string) {
    // ruleid: sentinel-jwt-decode-without-verify
    return jwt.decode(token, { json: true });
  }
}

export const roleOf = (token: string) => {
  // ruleid: sentinel-jwt-decode-without-verify
  const payload: any = jwt.decode(token);
  return payload?.role;
};

// decode() to read the header (kid) before verifying is the normal pattern.
export function verifyWithKeySet(token: string, keys: Record<string, string>) {
  // ok: sentinel-jwt-decode-without-verify
  const header = jwt.decode(token, { complete: true })?.header;
  const key = keys[header?.kid ?? ''];
  return jwt.verify(token, key, { algorithms: ['RS256'] });
}

// Verified inside a try block after decoding.
export function verifiedClaims(token: string, key: string) {
  // ok: sentinel-jwt-decode-without-verify
  const unverified = jwt.decode(token);
  try {
    return jwt.verify(token, key, { algorithms: ['HS256'] });
  } catch {
    console.warn('rejected token for', (unverified as any)?.sub);
    return null;
  }
}

// Verified with @nestjs/jwt in the same method.
export class GuardedReader {
  constructor(private readonly jwtService: { verifyAsync(t: string): Promise<unknown> }) {}
  async read(token: string) {
    // ok: sentinel-jwt-decode-without-verify
    const kid = (jwt.decode(token, { complete: true }) as any)?.header?.kid;
    return { kid, claims: await this.jwtService.verifyAsync(token) };
  }
}

// A different library's decode() is not this rule's concern.
export function base64(s: string) {
  // ok: sentinel-jwt-decode-without-verify
  return decodeURIComponent(s);
}
