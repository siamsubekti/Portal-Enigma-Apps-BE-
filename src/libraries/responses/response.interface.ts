import { ResponseStatus, PagingData } from './response.class';

export interface IApiPagedResponse {
  status: ResponseStatus;
  data: any[];
  paging: PagingData;
}

export interface IApiResponse {
  status: ResponseStatus;
  data: any;
}
