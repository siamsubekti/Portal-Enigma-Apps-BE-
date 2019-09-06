
import * as md5 from 'md5';
import { join } from 'path';
import { existsSync } from 'fs';
import { Response, Request } from 'express';
import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, UseGuards, Req, Res, NotFoundException, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiImplicitFile,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { multerOptions } from '../../../../config/multer.config';
import { ResponseRebuildInterceptor } from '../../../../libraries/responses/response.interceptor';
import { ApiExceptionResponse } from '../../../../libraries/responses/response.type';
import { DocumentResponse, DocumentDTO } from '../models/document.dto';
import Document from '../models/document.entity';
import DocumentService from '../services/document.service';
import CookieAuthGuard from '../../../auth/guards/cookie.guard';

@Controller('documents')
@ApiUseTags('Documents')
@UseGuards(CookieAuthGuard)
export default class DocumentController {
  constructor( private readonly docService: DocumentService ) {}

  @Post('upload')
  @UseInterceptors(ResponseRebuildInterceptor, FileInterceptor('file', multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({ name: 'file', required: true })
  @ApiCreatedResponse({ description: 'Document data.', type: DocumentResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
  @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
  async upload( @Req() request: Request, @UploadedFile() file: any ): Promise<Document> {

    const { id } = request.user;

    const doc: DocumentDTO = new DocumentDTO();
    doc.name = file.originalname;
    doc.size = file.size;
    doc.type = file.mimetype;
    doc.filepath = file.path.replace(`${process.env.UPLOAD_LOCATION}/`, '');
    doc.accountId = md5(id);

    return await this.docService.create(doc);
  }

  @Get('download/:accountId/:filename')
  @ApiNotFoundResponse({ description: 'Not found.' })
  @ApiOkResponse({ description: 'File to be downloaded.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
  @ApiNotFoundResponse({ description: 'File cannot be found.', type: ApiExceptionResponse })
  @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
  async download( @Param('accountId') accountId: string, @Param('filename') filename: string, @Res() res: Response): Promise<void> {
    const document: Document = await this.docService.findByAccountIdAndName(accountId, filename);
    const documentPath: string =  document ? join(process.env.BASE_PATH, process.env.UPLOAD_LOCATION, document.filepath) : null;

    if (!documentPath && !existsSync(documentPath)) {
      Logger.error(`File ${documentPath} cannot be found.`);
      throw new NotFoundException(`File ${filename} (${accountId}) not found.`);
    }

    res.append('Content-Type', document.type);
    res.download(documentPath, document.name);
  }
}
