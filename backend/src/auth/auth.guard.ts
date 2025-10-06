import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Token não fornecido');
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = this.authService.validateToken(token);

    if (!payload) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }


    request.user = payload;

    return true; 
  }
}
