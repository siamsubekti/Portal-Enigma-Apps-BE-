import { ResponseStatus, PagingData } from './response.class';
import { ApiResponse, ApiPagedResponse } from './response.type';
import { IApiResponse, IApiPagedResponse } from './response.interface';

export default class ResponseUtil {
  private readonly defaultStatus: ResponseStatus;
  constructor() {
    this.defaultStatus = {
      code: '200',
      description: 'OK',
    };
  }

  rebuildResponse(data: any, status: ResponseStatus = this.defaultStatus): ApiResponse {
    const response: IApiResponse = {
      status,
      data,
    };

    return response;
  }

  rebuildPagedResponse(data: any[], paging?: PagingData, status: ResponseStatus = this.defaultStatus): ApiPagedResponse {
    const response: IApiPagedResponse = {
      status,
      data,
      paging,
    };

    return response;
  }
}
