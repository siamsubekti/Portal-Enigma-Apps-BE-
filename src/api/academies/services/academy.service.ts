import { Repository, DeleteResult } from 'typeorm';
import { Injectable, HttpException, HttpStatus, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Academy from '../models/academy.entity';
import AcademyDTO from '../models/academy.dto';

@Injectable()
export class AcademyService {
    constructor(
    @InjectRepository(Academy)
    private readonly academy: Repository<Academy>,
    ) {}

    async getAcademies(): Promise<Academy[]>  {
        const data = await this.academy.find();
        Logger.log(data);
        try {
            if (!data) throw new HttpException('Id Not Found', HttpStatus.NOT_FOUND);
            return data;
        } catch (error) {
            Logger.error(error);
            throw error;
        }
    }

    async insertAcademy(academyDTO: AcademyDTO): Promise<Academy> {
        const codeIsExist: Academy = await this.academy.findOne({
            where: {code: academyDTO.code}});
        const phoneIsExist: Academy = await this.academy.findOne({
            where: {phone: academyDTO.phone}});
        try {
            if (codeIsExist) throw new HttpException('Code has been use', HttpStatus.AMBIGUOUS);
            if (phoneIsExist) throw new HttpException('Phone has been use', HttpStatus.AMBIGUOUS);
            const data = await this.academy.save(academyDTO);
            return data;
        } catch (error) {
            Logger.error(error);
            throw error;
        }
    }

    async getAcademy(id: number): Promise<Academy> {
        const data = await this.academy.findOne(id);
        Logger.log(data);
        try {
            if (!data) throw new HttpException('Id not found', HttpStatus.NOT_FOUND);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, academyDTO: AcademyDTO): Promise<Academy> {
        const data: Academy = await this.academy.findOne(id);
        try {
            const academy = this.academy.merge(data, academyDTO);
            Logger.log(academy);
            const result = await this.academy.save(academy);
            Logger.log(result);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<DeleteResult> {
        const academy: Academy = await this.academy.findOne(id);
        try {
            if (!academy) throw new HttpException('Id Not Found', HttpStatus.NOT_FOUND);
            const result = await this.academy.delete(id);
            Logger.log(result);
            return result;
        } catch (error) {
            throw error;
        }
    }
}
