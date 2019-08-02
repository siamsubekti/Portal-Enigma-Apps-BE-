import MenuService from '../services/menu.service';
import { MenuPagedResponse, MenuDTO, MenuResponse } from '../models/menu.dto';
import { UseInterceptors, Get, Controller, Post, Body, Param, Put, Logger, Delete, UseGuards, Query } from '@nestjs/common';
import { ResponseRebuildInterceptor } from '../../../../libraries/responses/response.interceptor';
import { ApiUseTags, ApiOperation, ApiOkResponse, ApiInternalServerErrorResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiImplicitQuery, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiExceptionResponse, ApiResponse } from '../../../../libraries/responses/response.type';
import { DeleteResult } from 'typeorm';
import Menu from '../models/menu.entity';
import CookieAuthGuard from 'src/api/auth/guards/cookie.guard';
import AppConfig from 'src/config/app.config';
import { PagingData } from 'src/libraries/responses/response.class';

@UseGuards(CookieAuthGuard)
@ApiUseTags('Menus')
@Controller('menus')
export default class MenuController {
    constructor(
        private readonly menuService: MenuService,
        private readonly config: AppConfig,
    ) {}

    @Get()
    @ApiOperation({ title: 'List of Menus.', description: 'Get list of menu from database.'})
    @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
    @ApiImplicitQuery({ name: 'page', description: 'Current page number', type: 'number', required: false })
    @ApiOkResponse({ description: 'List of menus.', type: MenuPagedResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async allMenu(
        @Query('term') term?: string,
        @Query('page') page: number = 1,
    ): Promise<MenuPagedResponse> {
        const rowsPerPage: number = Number(this.config.get('ROWS_PER_PAGE'));
        const { result: data = [], totalRows } = await this.menuService.all({ term, page, rowsPerPage });
        const paging: PagingData = {
        page,
        rowsPerPage,
        totalPages: Math.ceil( totalRows / rowsPerPage ),
        totalRows,
        };
        return {
            status: {
                code: '200',
                description: 'Success',
            }, data, paging };
    }

    @Get(':id/subs')
    @ApiOperation({ title: 'List of Sub Menus.', description: 'Get list of sub menu from database.'})
    @ApiOkResponse({ description: 'List of sub menu.', type: ApiResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async allSubMenu(): Promise<MenuPagedResponse> {
        const { result: data = [] } = await this.menuService.allSub();
        return { data };
    }

    @Get('search')
    @ApiOperation({ title: 'Search Menu.', description: 'Search menu.'})
    @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
    @ApiImplicitQuery({ name: 'order', description: 'Order columns (code, name, order, or icon)', type: ['code', 'name', 'order', 'icon'], required: false })
    @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
    @ApiOkResponse({ description: 'Search result of major.', type: ApiResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
    async search(
        @Query('term') term?: string,
        @Query('order') order: 'code' | 'name' | 'order' | 'icon' = 'name',
        @Query('sort') sort: 'asc' | 'desc' = 'asc',
    ): Promise<MenuResponse> {
        const { result: data = [] } = await this.menuService.all({ term, order, sort, page: 1, rowsPerPage: 1000 });

        return { data };
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
