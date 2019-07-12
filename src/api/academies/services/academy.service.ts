import { Repository, DeleteResult } from 'typeorm';
import { Injectable, Logger, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Academy from '../models/academy.entity';
import { AcademyResponseDTO, AcademyDTO } from '../models/academy.dto';

@Injectable()
export class AcademyService {
    constructor(
    @InjectRepository(Academy)
    private readonly academy: Repository<Academy>,
    ) {}

    async getAcademies(): Promise<AcademyResponseDTO[]>  {
        try {
            const Result = await this.academy.find();
            return Result;
        } catch (error) {
            throw new InternalServerErrorException('Internal server error');
        }
    }

    async insertAcademy(academyDTO: AcademyDTO): Promise<AcademyResponseDTO> {
        const codeIsExist: Academy = await this.academy.findOne({
            where: {code: academyDTO.code}});
        const phoneIsExist: Academy = await this.academy.findOne({
            where: {phone: academyDTO.phone}});
        if (codeIsExist) throw new BadRequestException('Code has been use');
        if (phoneIsExist) throw new BadRequestException('Phone has been use');
        try {
            const data = await this.academy.save(academyDTO);
            return data;
        } catch (error) {
            Logger.error(error);
            throw new InternalServerErrorException('Internal server error');
        }
    }

    async getAcademy(id: number): Promise<AcademyResponseDTO> {
        const data: Academy = await this.academy.findOne(id);
        if (!data) throw new NotFoundException('Academy not Found');
        try {
            return data;
        } catch (error) {
            throw new InternalServerErrorException('Internal server error');
        }
    }

    async update(id: number, academyDTO: AcademyDTO): Promise<AcademyResponseDTO> {
        let data: Academy = await this.academy.findOne({where: {id}});
        if (!data) throw new NotFoundException('Academy not found');
        try {
            data = this.academy.merge(data, academyDTO);
            const updateAcademy = await this.academy.save(data);
            return updateAcademy;
        } catch (error) {
            throw new InternalServerErrorException('Internal server error');
        }
    }

    async delete(id: number): Promise<DeleteResult> {
        const academy: boolean = await this.academy.count({id}) >  0;
        if (!academy) throw new NotFoundException('Academy not found');
        try {
            const removeAcademy: DeleteResult = await this.academy.delete(id);
            return removeAcademy;
        } catch (error) {
            throw new InternalServerErrorException('Internal server error');
        }
    }
}
