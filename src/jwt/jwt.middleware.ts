import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { JwtService } from './jwt.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtMiddleWare implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      try {
        const decoded = this.jwtService.verit(token.toString());
        // decoded 타입이 object 이고 decoded의 프로퍼티 중에 id가 있으면
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const { user } = await this.userService.findById(decoded['id']);
          // request 객체에 user 프로퍼티와 값을 추가한다.
          // 이렇게 추가된 객체는 AuthUser 데코레이터에서 추출하여 사용
          req['user'] = user;
        }
      } catch (e) {}
    }
    next();
  }
}
