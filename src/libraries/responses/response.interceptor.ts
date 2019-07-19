import { Response as ResponseContext } from 'express';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseStatus, PagingData } from './response.class';
import HttpStatusMessage from '../../config/constants';

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
      description: response.statusMessage || HttpStatusMessage[response.statusCode] || '-',
    };

    // Logger.log(response, 'ResponseInterceptor @intercept', true);
    // Logger.log(status, 'ResponseInterceptor @intercept', true);

    return next.handle().pipe(
      map((body: any) => this.rebuildResponseBody(body, status)));
  }

  private rebuildResponseBody(body: any, status: ResponseStatus): Response<T> {
    const { data, paging } = body;

    Logger.log(body, 'ResponseInterceptor @rebuildResponseBody');
    return { status, data: ( paging ? data : body ), paging};
  }
}
