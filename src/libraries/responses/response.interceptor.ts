import { Response as ResponseContext } from 'express';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseStatus, PagingData } from './response.class';

export interface Response<T> {
  status: ResponseStatus;
  data: T;
  paging?: PagingData;
}

@Injectable()
export class ResponseRebuildInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const response: ResponseContext = context.switchToHttp().getResponse();
    const status: ResponseStatus = {
      code: `${response.statusCode}`,
      description: response.statusMessage || 'OK',
    };

    return next.handle().pipe(
      map((body: any) => this.rebuildResponseBody(body, status)));
  }

  private rebuildResponseBody(body: any, status: ResponseStatus): Response<T> {
    const { data, paging } = body;

    return { status, data: ( paging ? data : body ), paging};
  }
}
