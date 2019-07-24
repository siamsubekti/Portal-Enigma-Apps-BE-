import { MenuService } from '../services/menu.service';
import { MenuResponseDTO, MenuPagedResponse, MenuDTO, MenuResponse } from '../models/menu.dto';
import { UseInterceptors, Get, InternalServerErrorException, Controller, Post, Body, Param, Put, Logger, Delete } from '@nestjs/common';
import { ResponseRebuildInterceptor } from '../../../../libraries/responses/response.interceptor';
import { ApiUseTags, ApiOperation, ApiOkResponse, ApiInternalServerErrorResponse, ApiCreatedResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { ApiExceptionResponse } from '../../../../libraries/responses/response.type';
import { DeleteResult } from 'typeorm';

@ApiUseTags('Menus')
@Controller('menus')
export class MenuController {
    constructor(
        private readonly menuService: MenuService,
    ) {}

    @Get()
    @ApiOperation({title: 'List Menus', description: 'All Menus'})
    @ApiOkResponse({description: 'OK', type: MenuPagedResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @UseInterceptors(ResponseRebuildInterceptor)
    async listMenu(): Promise<MenuResponseDTO[]> {
        try {
            const menus: MenuResponseDTO[] = await this.menuService.getMenus();
            return menus;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    @Post('')
    @ApiOperation({title: 'Create Menu', description: 'Create Menu'})
    @ApiCreatedResponse({description: 'OK', type: MenuResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @UseInterceptors(ResponseRebuildInterceptor)
    async createMenu(@Body() form: MenuDTO): Promise<MenuResponseDTO> {
        try {
            const menu: MenuResponseDTO = await this.menuService.addMenu(form);
            return menu;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    @Get(':id')
    @ApiOperation({title: 'Detail Menu', description: 'Detail Menu'})
    @ApiOkResponse({description: 'OK', type: MenuResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @ApiNotFoundResponse({description: 'Menu Not Found', type: ApiExceptionResponse})
    @UseInterceptors(ResponseRebuildInterceptor)
    async getAcademyById(@Param('id') id: number): Promise<MenuResponseDTO> {
        try {
            const menu: MenuResponseDTO = await this.menuService.getMenu(id);
            return menu;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    @Put(':id')
    @ApiOperation({title: 'Update Menu', description: 'Update Menu'})
    @ApiOkResponse({description: 'OK', type: MenuResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @ApiNotFoundResponse({description: 'Menu Not Found', type: ApiExceptionResponse})
    @UseInterceptors(ResponseRebuildInterceptor)
    async updateAcademy(@Param('id') id: number, @Body() form: MenuDTO): Promise<MenuResponseDTO> {
        try {
            const menu: MenuResponseDTO = await this.menuService.update(id, form);
            return menu;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    @Delete(':id')
    @ApiOperation({title: 'Delete Menu', description: 'Delete Menu'})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @ApiNotFoundResponse({description: `Menu Not Found`, type: ApiExceptionResponse})
    async DeleteAcademy(@Param('id') id: number): Promise<DeleteResult> {
        const {affected}: DeleteResult = await this.menuService.delete(id);
        Logger.log(affected);
        if (affected === 1) return null;
    }
}
