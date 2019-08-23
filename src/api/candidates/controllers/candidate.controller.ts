import {
    Controller, Get, Query, UseGuards,
    Post, UseInterceptors, Param, UploadedFile, Res, Header, Request,
} from '@nestjs/common';
import {
    ApiUseTags,
    ApiOperation,
    ApiImplicitQuery,
    ApiOkResponse,
    ApiUnauthorizedResponse,
    ApiInternalServerErrorResponse,
    ApiConsumes,
    ApiImplicitFile,
    ApiCreatedResponse,
    ApiProduces,
    ApiNotFoundResponse,
} from '@nestjs/swagger';
import CandidateService from '../services/candidate.service';
import { ApiPagedResponse, ApiExceptionResponse } from '../../../libraries/responses/response.type';
import { AccountPagedResponse, AccountSearchResponse, AccountResponseDTO } from '../../../api/accounts/models/account.dto';
import { PagingData } from '../../../libraries/responses/response.class';
import AppConfig from '../../../config/app.config';
import CookieAuthGuard from '../../../api/auth/guards/cookie.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentDTO, DocumentResponse } from '../../../api/resumes/document/models/document.dto';
import DocumentService from '../../../api/resumes/document/services/document.service';
import { ResponseRebuildInterceptor } from '../../../libraries/responses/response.interceptor';
import { Response } from 'express';
import Document from '../../../api/resumes/document/models/document.entity';
import { multerOptions } from '../../../config/multer.config';

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
        const { result = [], totalRows } = await this.candidateServices.getCandidates({ term, order, sort, page, rowsPerPage });
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
    @ApiImplicitQuery({ name: 'order', description: 'Order columns (username, fullname, or nickname)', type: ['username', 'fullname', 'nickname'], required: false })
    @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
    @ApiOkResponse({ description: 'Search result of candidates.', type: AccountSearchResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
    async search(
        @Query('term') term?: string,
        @Query('order') order: 'username' | 'fullname' | 'nickname' = 'fullname',
        @Query('sort') sort: 'asc' | 'desc' = 'asc',
    ): Promise<AccountPagedResponse> {
        const { result } = await this.candidateServices.searchCandidates({ term, order, sort, rowsPerPage: 1000 });
        const data: AccountResponseDTO[] = [];

        for (const account of result)
            data.push({
                ...account,
                roles: undefined,
            });

        return { data };
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', multerOptions))
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({ name: 'file', required: true })
    @ApiCreatedResponse({ description: 'Document data.', type: DocumentResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async upload(
        @Request() request: any,
        @UploadedFile() file: any): Promise<Document> {

        const { id } = request.user;

        const doc: DocumentDTO = new DocumentDTO();
        doc.name = file.originalname;
        doc.size = file.size;
        doc.type = file.mimetype;
        doc.filepath = file.path.replace(`${process.env.UPLOAD_LOCATION}/`, '');
        doc.accountId = id;

        return await this.docService.create(doc);
    }

    @Get('download/:path')
    @Header('Content-type', 'application/pdf')
    @ApiProduces('application/pdf')
    @ApiNotFoundResponse({ description: 'Not found.' })
    @ApiOkResponse({ description: 'Success get file to download.' })
    async download(@Param('path') path: string, @Res() res: Response): Promise<any> {

        const downloadPath: Document = await this.docService.getFilenameByPath(path);
        if (downloadPath) return res.download(process.env.UPLOAD_LOCATION + `/${path}`, downloadPath.name, (err: Error) => {
            if (err) res.sendStatus(404);
        });
    }
}
