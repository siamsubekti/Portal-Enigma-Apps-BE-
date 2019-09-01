import * as md5 from 'md5';
import * as moment from 'moment';
import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
  Param,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiUseTags,
  ApiOperation,
  ApiImplicitQuery,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiImplicitParam,
} from '@nestjs/swagger';
import { ApiExceptionResponse } from '../../../libraries/responses/response.type';
import { PagingData } from '../../../libraries/responses/response.class';
import { ResponseRebuildInterceptor } from '../../../libraries/responses/response.interceptor';
import { CandidateDocumentResponse, CandidateQueryDTO } from '../models/candidate.dto';
import { AccountPagedResponse, AccountSearchResponse, AccountResponseDTO } from '../../accounts/models/account.dto';
import AppConfig from '../../../config/app.config';
import CookieAuthGuard from '../../auth/guards/cookie.guard';
import DocumentService from '../../resumes/document/services/document.service';
import Account from '../../accounts/models/account.entity';
import Document from '../../resumes/document/models/document.entity';
import CandidateService from '../services/candidate.service';

@Controller('candidates')
@ApiUseTags('Candidates')
@UseGuards(CookieAuthGuard)
export default class CandidateController {
  constructor(
    private readonly candidateServices: CandidateService,
    private readonly config: AppConfig,
    private readonly docService: DocumentService,
  ) { }

  @Get()
  @ApiOperation({ title: 'List of registered Candidates.', description: 'Get list of registered candidates.' })
  @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
  @ApiImplicitQuery({ name: 'start', description: 'Start date range (DD-MM-YYYY)', type: 'string', required: false })
  @ApiImplicitQuery({ name: 'end', description: 'End date range (DD-MM-YYYY)', type: 'string', required: false })
  @ApiImplicitQuery({ name: 'order', description: 'Order columns (fullname, email, birthdate, age)', type: ['fullname', 'email', 'birthdate', 'age'], required: false })
  @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
  @ApiImplicitQuery({ name: 'page', description: 'Current page number', type: 'number', required: false })
  @ApiOkResponse({ description: 'List of registered candidates.', type: AccountPagedResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
  @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
  @UseInterceptors(ResponseRebuildInterceptor)
  async get(
    @Query('term') term?: string,
    @Query('start') startDate?: string,
    @Query('end') endDate?: string,
    @Query('order') order: 'fullname' | 'email' | 'birthdate' | 'age' = 'fullname',
    @Query('sort') sort: 'asc' | 'desc' = 'asc',
    @Query('page') page: number = 1,
  ): Promise<AccountPagedResponse> {
    const rowsPerPage: number = Number(this.config.get('ROWS_PER_PAGE'));
    const queryParams: CandidateQueryDTO = {
      term, order, sort, page,
      startDate: startDate ? moment(startDate, 'DD-MM-YYYY') : undefined,
      endDate: endDate ? moment(endDate, 'DD-MM-YYYY') : undefined,
    };
    const { result = [], totalRows } = await this.candidateServices.getCandidates(queryParams);
    const paging: PagingData = {
      page: Number(page),
      rowsPerPage,
      totalPages: Math.ceil(totalRows / rowsPerPage),
      totalRows,
    };
    const data: AccountResponseDTO[] = [];

    for (const account of result)
      data.push({
        ...account,
        roles: undefined,
      });

    return { data, paging };
  }

  @Get('search')
  @ApiOperation({ title: 'Search candidates.', description: 'Search candidates.' })
  @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
  @ApiImplicitQuery({ name: 'order', description: 'Order columns (fullname, email, birthdate, age)', type: ['fullname', 'email', 'birthdate', 'age'], required: false })
  @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
  @ApiOkResponse({ description: 'Search result of candidates.', type: AccountSearchResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
  @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
  @UseInterceptors(ResponseRebuildInterceptor)
  async search(
    @Query('term') term?: string,
    @Query('order') order: 'fullname' | 'email' | 'birthdate' | 'age' = 'fullname',
    @Query('sort') sort: 'asc' | 'desc' = 'asc',
  ): Promise<AccountPagedResponse> {
    const { result } = await this.candidateServices.getCandidates({ term, order, sort, page: 1, rowsPerPage: 1000 });
    const data: AccountResponseDTO[] = [];

    for (const account of result)
      data.push({
        ...account,
        roles: undefined,
      });

    return { data };
  }

  @Get('documents/:accountId')
  @UseInterceptors(ResponseRebuildInterceptor)
  @ApiOperation({ title: 'List registered candidates.', description: 'API to get data registered candidates.' })
  @ApiImplicitParam({ name: 'accountId', description: 'Account ID', type: 'string', required: true })
  @ApiOkResponse({ description: 'List of documents related to the candidate ID.', type: CandidateDocumentResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
  async documents(@Param('accountId') id: string): Promise<string[]> {
    const candidate: Account = await this.candidateServices.find(id);
    const documents: Document[] = candidate ? await this.docService.findByAccountId(md5(candidate.id)) : [];
    const docs: string[] = documents.map((doc: Document) => {
      return `documents/download/${md5(candidate.id)}/${doc.name}`;
    });

    if (!candidate) throw new NotFoundException(`Candidate account ID ${id} is invalid.`);

    return docs;
  }
}
