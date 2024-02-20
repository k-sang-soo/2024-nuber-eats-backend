import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { AllowedRoles } from './role.decorator';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  // Reflector: metadata 를 get 하기 위해 필요함
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // context를 받으면 http로 되어있음
    // 이걸 GraphQl의 context로 변경하는 작업
    const roles = this.reflector.get<AllowedRoles>(
      'roles',
      context.getHandler(),
    );

    //metadata를 지정하지 않았으면 로그인이 필요 없는 경우임
    if (!roles) {
      return true;
    }
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user: User = gqlContext['user'];

    if (!user) {
      return false;
    }

    //접근 권한이 없을 경우
    if (roles.includes('Any')) return true;

    return roles.includes(user.role);
  }
}
