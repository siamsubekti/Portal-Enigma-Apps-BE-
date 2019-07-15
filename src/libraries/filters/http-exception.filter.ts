import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ApiResponse } from '../responses/response.type';
import { ResponseStatus } from '../responses/response.class';
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const body: ApiResponse = new ApiResponse();
    const { error } = exception.getResponse() as any;
    let { message } = exception.getResponse() as any;

    if (Array.isArray(message)) message = this.extractValidationMessages(message);

    body.status = new ResponseStatus();
    body.status.code = `${exception.getStatus()}`;
    body.status.description = message || error;

    response
      .status(exception.getStatus())
      .json(body);
  }

  private extractValidationMessages(errors: ValidationError[]): string {
    const error: ValidationError = errors.shift();
    const constraint: string = Object.keys(error.constraints).shift();

    return `Form validation failed: ${error.constraints[ constraint ]}.`;
  }
}
