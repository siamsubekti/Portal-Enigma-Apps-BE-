import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiUseTags, ApiOperation, ApiNoContentResponse } from '@nestjs/swagger';
import MigrationService from '../services/migration.service';

@Controller('migrate')
@ApiUseTags('Migrations')
export default class MigrationController {
  constructor(
    private readonly migrationService: MigrationService,
  ) {}

  @Get('start')
  @ApiOperation({description: 'Start migration process, creates initial data', title: 'Migration'})
  @ApiNoContentResponse({description: 'No content will be returned, the migration process is running in the background.'})
  async start(@Res() response: Response): Promise<void> {
    this.migrationService.start();

    response.sendStatus(204);
  }
}
