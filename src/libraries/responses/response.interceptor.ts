import { Response as ResponseContext } from 'express';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
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
    const responseContext: ResponseContext = context.switchToHttp().getResponse();

    // Logger.log(response, 'ResponseInterceptor @intercept', true);
    // Logger.log(status, 'ResponseInterceptor @intercept', true);

    return next.handle().pipe(
      map((body: any) => this.rebuildResponseBody(body, responseContext)));
  }

  private rebuildResponseStatus(status: ResponseStatus, responseContext: ResponseContext): ResponseStatus {
    let responseStatus: ResponseStatus = {
      code: `${responseContext.statusCode}`,
      description: responseContext.statusMessage || HttpStatusMessage[responseContext.statusCode] || '-',
    };

    if (status && typeof status === 'object') {
      const { code, description } = status;
      responseStatus = { code, description };
    }

    return responseStatus;
  }

  private rebuildResponseBody(body: any, responseContext: ResponseContext): Response<T> {
    const { status: responseStatus, data, paging } = body || { status: undefined, data: undefined, paging: undefined };
    const status: ResponseStatus = this.rebuildResponseStatus(responseStatus, responseContext);

    // Logger.log(body, 'ResponseInterceptor @rebuildResponseBody');
    if (typeof responseStatus === 'object' && responseStatus.code && responseStatus.description)
      delete body.status;

    const respone: Response<T> = { status, data: (data || body), paging };

    return respone;
  }
}
