import MenuService from '../services/menu.service';
import { MenuPagedResponse, MenuDTO, MenuResponse } from '../models/menu.dto';
import { UseInterceptors, Get, InternalServerErrorException, Controller, Post, Body, Param, Put, Logger, Delete, UseGuards } from '@nestjs/common';
import { ResponseRebuildInterceptor } from '../../../../libraries/responses/response.interceptor';
import { ApiUseTags, ApiOperation, ApiOkResponse, ApiInternalServerErrorResponse, ApiCreatedResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { ApiExceptionResponse } from '../../../../libraries/responses/response.type';
import { DeleteResult } from 'typeorm';
import Menu from '../models/menu.entity';
import CookieAuthGuard from 'src/api/auth/guards/cookie.guard';

@UseGuards(CookieAuthGuard)
@ApiUseTags('Menus')
@Controller('menus')
export default class MenuController {
    constructor(
        private readonly menuService: MenuService,
    ) {}

    @Get()
    @ApiOperation({title: 'List Menus', description: 'All Menus'})
    @ApiOkResponse({description: 'OK', type: MenuPagedResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @UseInterceptors(ResponseRebuildInterceptor)
    async allMenu(): Promise<Menu[]> {
        try {
            const menus: Menu[] = await this.menuService.all();
            return menus;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    @Post()
    @ApiOperation({title: 'Create Menu', description: 'Create Menu'})
    @ApiCreatedResponse({description: 'OK', type: MenuResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @UseInterceptors(ResponseRebuildInterceptor)
    async addMenu(@Body() form: MenuDTO): Promise<Menu> {
        try {
            const menu: Menu = await this.menuService.add(form);
            Logger.log(menu);
            return menu;
        } catch (error) {
            throw error;
        }
    }

    @Get(':id')
    @ApiOperation({title: 'Detail Menu', description: 'Detail Menu'})
    @ApiOkResponse({description: 'OK', type: MenuResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @ApiNotFoundResponse({description: 'Menu Not Found', type: ApiExceptionResponse})
    @UseInterceptors(ResponseRebuildInterceptor)
    async getMenu(@Param('id') id: number): Promise<Menu> {
        try {
            const menu: Menu = await this.menuService.get(id);
            return menu;
        } catch (error) {
            throw error;
        }
    }

    @Put(':id')
    @ApiOperation({title: 'Update Menu', description: 'Update Menu'})
    @ApiOkResponse({description: 'OK', type: MenuResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @ApiNotFoundResponse({description: 'Menu Not Found', type: ApiExceptionResponse})
    @UseInterceptors(ResponseRebuildInterceptor)
    async editMenu(@Param('id') id: number, @Body() form: MenuDTO): Promise<Menu> {
        try {
            const menu: Menu = await this.menuService.update(id, form);
            return menu;
        } catch (error) {
            throw error;
        }
    }

    @Delete(':id')
    @ApiOperation({title: 'Delete Menu', description: 'Delete Menu'})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @ApiNotFoundResponse({description: `Menu Not Found`, type: ApiExceptionResponse})
    async deleteMenu(@Param('id') id: number): Promise<DeleteResult> {
        const {affected}: DeleteResult = await this.menuService.delete(id);
        Logger.log(affected);
        if (affected === 1) return null;
    }
}
