import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiImplicitQuery, ApiOkResponse, ApiUnauthorizedResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import CandidateService from '../services/candidate.service';
import { ApiPagedResponse, ApiExceptionResponse } from '../../../libraries/responses/response.type';
import { AccountPagedResponse } from '../../../api/accounts/models/account.dto';
import { PagingData } from '../../../libraries/responses/response.class';
import AppConfig from '../../../config/app.config';
import CookieAuthGuard from '../../../api/auth/guards/cookie.guard';

@Controller('candidates')
@ApiUseTags('Candidates')
@UseGuards(CookieAuthGuard)
export default class CandidateController {
    constructor(
        private readonly candidateServices: CandidateService,
        private readonly config: AppConfig,
    ) { }

    @Get()
    @ApiOperation({ title: 'List of registered Candidates.', description: 'Get list of registered candidates.' })
    @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
    @ApiImplicitQuery({ name: 'order', description: 'Order columns (username, fullname, or nickname)', type: ['username', 'fullname', 'nickname'], required: false })
    @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
    @ApiImplicitQuery({ name: 'page', description: 'Current page number', type: 'number', required: false })
    @ApiOkResponse({ description: 'List of registered candidates.', type: ApiPagedResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
    async get(
        @Query('term') term?: string,
        @Query('order') order: 'username' | 'fullname' | 'nickname' = 'fullname',
        @Query('sort') sort: 'asc' | 'desc' = 'asc',
        @Query('page') page: number = 1,
    ): Promise<AccountPagedResponse> {
        const rowsPerPage: number = Number(this.config.get('ROWS_PER_PAGE'));
        const { result: data = [], totalRows } = await this.candidateServices.getCandidates({ term, order, sort, page, rowsPerPage });
        const paging: PagingData = {
            page,
            rowsPerPage,
            totalPages: Math.ceil(totalRows / rowsPerPage),
            totalRows,
        };

        return { data, paging };
    }

    @Get('search')
    @ApiOperation({ title: 'Search candidates.', description: 'Search candidates.' })
    @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
    @ApiImplicitQuery({ name: 'order', description: 'Order columns (username, fullname, or nickname)', type: ['username', 'fullname', 'nickname'], required: false })
    @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
    @ApiOkResponse({ description: 'Search result of candidates.', type: ApiPagedResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
    async search(
        @Query('term') term?: string,
        @Query('order') order: 'username' | 'fullname' | 'nickname' = 'fullname',
        @Query('sort') sort: 'asc' | 'desc' = 'asc',
    ): Promise<AccountPagedResponse> {
        const { result: data = [] } = await this.candidateServices.searchCandidates({ term, order, sort, rowsPerPage: 1000 });

        return { data };
    }
}
