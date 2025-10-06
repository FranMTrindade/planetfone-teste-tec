import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  public users: any[] = [];
  private refreshTokens: any[] = []; 

  constructor(private readonly jwtService: JwtService) {}

  async register(user: any) {
    const exists = this.users.find((u) => u.email === user.email);
    if (exists) {
      return { error: 'E-mail já registrado. Use outro e-mail.' };
    }

    const passwordHash = await bcrypt.hash(user.password, 10);
    const newUser = {
      id: uuidv4(),
      name: user.name,
      email: user.email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    return { message: 'Usuário registrado com sucesso' };
  }

  async login(credentials: any) {
    const found = this.users.find((u) => u.email === credentials.email);
    if (!found) {
      return { message: 'Usuário ou senha inválidos' };
    }

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      found.passwordHash,
    );
    if (!isPasswordValid) {
      return { message: 'Usuário ou senha inválidos' };
    }

    const payload = { sub: found.id, name: found.name, email: found.email };
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = uuidv4();

    this.refreshTokens.push({ userId: found.id, token: refresh_token });

    return {
      message: 'Login realizado com sucesso',
      access_token,
      refresh_token,
    };
  }

  async refresh(refreshToken: string) {
    const session = this.refreshTokens.find((s) => s.token === refreshToken);
    if (!session) {
      return { error: 'Refresh token inválido' };
    }

    const user = this.users.find((u) => u.id === session.userId);
    if (!user) {
      return { error: 'Usuário não encontrado' };
    }

    const payload = { sub: user.id, name: user.name, email: user.email };
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });

    return { access_token };
  }

  async logout(refreshToken: string) {
    const before = this.refreshTokens.length;
    this.refreshTokens = this.refreshTokens.filter(
      (s) => s.token !== refreshToken,
    );

    const after = this.refreshTokens.length;
    const removed = before > after;

    if (removed) {
      return { message: 'Logout realizado com sucesso' };
    } else {
      return { error: 'Refresh token inválido ou já expirado' };
    }
  }

  validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      return null;
    }
  }
}
