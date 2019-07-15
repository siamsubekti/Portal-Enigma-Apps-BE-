import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiService {
  getHello(): string {
    return 'Halo!';
  }

  async getSingleResponse(): Promise<any> {
    return { single: true };
  }

  async getArrayResponse(): Promise<any> {
    return {
      data: [
        { single: false },
        { single: false },
      ],
      paging: {
        page: 1,
        totalPages: 1,
        totalRows: 1,
        rowsPerPage: 10,
      },
    };
  }
}
