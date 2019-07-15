import { RoleService } from '../services/role.service';
import ResponseUtil from '../../../libraries/responses/response.util';
import { RoleResponse, RolePagedResponse, RoleDTO, RoleResponseDTO } from '../models/role.dto';
import { Get, Controller, Body, Post, Logger, Param, Put, Delete } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiInternalServerErrorResponse,
     ApiUseTags, ApiCreatedResponse, ApiBadRequestResponse,
     ApiImplicitParam, ApiResponse, ApiAcceptedResponse } from '@nestjs/swagger';
import { ApiExceptionResponse } from '../../../libraries/responses/response.type';
import { DeleteResult } from 'typeorm';

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
    async list(): Promise<RolePagedResponse> {
        const role: RoleResponseDTO[] = await this.roleService.getRoles();
        return this.responseUtil.rebuildPagedResponse(role);
    }

    @Post('create')
    @ApiOperation({title: 'Create Role', description: 'Create Role'})
    @ApiCreatedResponse({description: 'Role successfuly created.', type: RoleResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @ApiBadRequestResponse({description: 'Code has been use'})
    async newRole(@Body() form: RoleDTO): Promise<RoleResponse> {
        const role: RoleResponseDTO = await this.roleService.insertRole(form);
        Logger.log(role);
        return this.responseUtil.rebuildResponse(role, {code: '201', description: 'Role successfuly created.'});
    }

    @Get(':id')
    @ApiOperation({title: 'Detail Role', description: 'Detail Role'})
    @ApiImplicitParam({name: 'id'})
    @ApiResponse({status: 202, description: 'Get role by id', type: RoleResponse })
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    async getAcademyById(@Param('id') id: number): Promise<RoleResponse> {
        const role: RoleResponseDTO = await this.roleService.getRole(id);
        Logger.log(role);
        return this.responseUtil.rebuildResponse(role, {code: '202', description: 'Get role by id'});
    }

    @Put(':id')
    @ApiOperation({title: 'Update Role', description: 'Update Role'})
    @ApiResponse({status: 203, description: 'Updated Major Success', type: RoleResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    async updateAcademy(@Param('id') id: number, @Body() form: RoleDTO): Promise<RoleResponse> {
        const role: RoleResponseDTO = await this.roleService.updateRole(id, form);
        return this.responseUtil.rebuildResponse(role, {code: '203', description: 'Update Success'});
    }

    @Delete(':id')
    @ApiOperation({title: 'Delete Role', description: 'Delete Role'})
    @ApiAcceptedResponse({description: 'Accepted', type: DeleteResult})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    async removeDegree(@Param('id') params: number): Promise<DeleteResult> {
        const {affected}: DeleteResult = await this.roleService.deleteRole(params);
        if (affected === 1) return null;
    }
}
