import { RoleService } from '../services/role.service';
import ResponseUtil from '../../../libraries/responses/response.util';
import { RoleResponse, RolePagedResponse, RoleDTO, RoleResponseDTO } from '../models/role.dto';
import { Get, Controller, Body, Post, Logger, Param, Put, Delete, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiInternalServerErrorResponse,
     ApiUseTags, ApiCreatedResponse, ApiBadRequestResponse,
     ApiImplicitParam, ApiResponse, ApiAcceptedResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { ApiExceptionResponse } from '../../../libraries/responses/response.type';
import { DeleteResult } from 'typeorm';
import { ResponseRebuildInterceptor } from 'src/libraries/responses/response.interceptor';

@ApiUseTags('Roles')
@Controller('roles')
export class RoleController {
    constructor(
        private readonly roleService: RoleService,
        private readonly responseUtil: ResponseUtil) {}

    @Get('list')
    @ApiOperation({title: 'List Roles', description: 'All Roles'})
    @ApiOkResponse({description: 'List Roles', type: RolePagedResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @UseInterceptors(ResponseRebuildInterceptor)
    async list(): Promise<RoleDTO[]> {
        const role: RoleDTO[] = await this.roleService.getRoles();
        Logger.log(role);
        return role;
    }

    @Post('create')
    @ApiOperation({title: 'Create Role', description: 'Create Role'})
    @ApiCreatedResponse({description: 'Role successfuly created.', type: RoleResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @UseInterceptors(ResponseRebuildInterceptor)
    @ApiBadRequestResponse({description: 'Code has been use'})
    async newRole(@Body() form: RoleDTO): Promise<RoleDTO> {
        const role: RoleDTO = await this.roleService.insertRole(form);
        Logger.log(role);
        return role;
    }

    @Get(':id')
    @ApiOperation({title: 'Detail Role', description: 'Detail Role'})
    @ApiOkResponse({description: 'Detail Degree', type: RoleResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @UseInterceptors(ResponseRebuildInterceptor)
    async getAcademyById(@Param('id') id: number): Promise<RoleDTO> {
        const role: RoleDTO = await this.roleService.getRole(id);
        Logger.log(role);
        return role;
    }

    @Put(':id')
    @ApiOperation({title: 'Update Role', description: 'Update Role'})
    @ApiResponse({status: 203, description: 'Updated Major Success', type: RoleResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @UseInterceptors(ResponseRebuildInterceptor)
    async updateAcademy(@Param('id') id: number, @Body() form: RoleDTO): Promise<RoleDTO> {
        const role: RoleDTO = await this.roleService.updateRole(id, form);
        Logger.log(role);
        return role;
    }

    @Delete(':id')
    @ApiOperation({title: 'Delete Role', description: 'Delete Role'})
    @ApiNotFoundResponse({description: 'Role Not Found', type: ApiExceptionResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    async removeDegree(@Param('id') params: number): Promise<DeleteResult> {
        const {affected}: DeleteResult = await this.roleService.deleteRole(params);
        if (affected === 1) return null;
    }
}
