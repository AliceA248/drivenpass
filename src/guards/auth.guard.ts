import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService, JWTPayload } from '../users/auth/auth.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRoute>();
    const { authorization } = request.headers;

    if (!authorization) {
      throw new UnauthorizedException('Missing authorization token.');
    }

    const parts = authorization.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedException('Invalid token.');
    }

    const token = parts[1];

    try {
      const data = await this.authService.validateToken(token);
      request.user = { email: data.email, id: data.id };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}

export type AuthenticatedRoute = Request & { user: JWTPayload };
