import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { delay, from, Observable, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';
import { sleep } from '../utility';

@Injectable()
export class LatencyInterceptor implements NestInterceptor {
  // bad code, should be set in a cache
  static delay: number = 0;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // apply latency before and after the request pipeline
    return from(sleep(LatencyInterceptor.delay)).pipe(
      switchMap(() => next.handle()),
      delay(LatencyInterceptor.delay),
    );
  }
}
