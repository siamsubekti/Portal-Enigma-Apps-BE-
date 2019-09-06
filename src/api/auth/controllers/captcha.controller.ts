import { Controller, Get, Res, Param, NotFoundException } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import HashUtil from '../../../libraries/utilities/hash.util';
import IORedis = require('ioredis');
import AppConfig from '../../../config/app.config';
import { Response } from 'express';
import { ApiUseTags, ApiOperation, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';

@ApiUseTags('Authentication')
@Controller('auth')
export default class CaptchaController {
    constructor(
        private readonly redisService: RedisService,
        private readonly hashUtil: HashUtil,
        private readonly config: AppConfig,
    ) { }

    @Get('verify')
    @ApiOperation({ title: 'Verify captcha.', description: 'Chaptcha verification.' })
    @ApiNotFoundResponse({ description: 'Not Found.' })
    @ApiOkResponse({ description: 'Success generate image.' })
    async getCaptcha(@Res() res: any): Promise<any> {
        const svgCaptcha: any = require('svg-captcha');
        const options: any = { size: 6, color: true, noise: 10, background: '#fff', width: 320, height: 120 };
        const captcha: any = await svgCaptcha.create(options);
        const id: string = this.hashUtil.createRandomString();
        const expiresIn: number = Number(this.config.get('PASSWORD_RESET_EXPIRES'));

        const client: IORedis.Redis = this.redisService.getClient();
        await client.set(id, JSON.stringify(captcha));
        await client.expire(id, expiresIn);

        res.json({ data: { token: id, image: `auth/image/${id}` } });
    }

    @Get('image/:id')
    @ApiOperation({ title: 'Get captcha image.', description: 'Get captcha image.' })
    @ApiNotFoundResponse({ description: 'Not Found.' })
    async getCaptchaImage(@Param('id') id: string, @Res() res: Response): Promise<any> {
        const client: IORedis.Redis = this.redisService.getClient();
        const image: { data: string, text: string } = client.exists(id) ? JSON.parse(await client.get(id)) : null;

        if (!image) throw new NotFoundException('Image not found.');

        res.send(image.data);
    }

    @Get(':id')
    async get(@Param('id') id: string): Promise<any> {
        const client: IORedis.Redis = this.redisService.getClient();
        return await client.get(id);
    }
}
