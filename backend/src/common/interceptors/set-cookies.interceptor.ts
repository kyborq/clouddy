import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class SetCookiesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: Tokens) => {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        response.cookie('jwt', data.accessToken, {
          httpOnly: true,
          secure: true,
          path: '/',
          maxAge: 1000 * 60,
        });
        response.cookie('refreshToken', data.refreshToken, {
          httpOnly: true,
          secure: true,
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        return data;
      }),
    );
  }
}
