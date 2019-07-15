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
            const Result: Academy[] = await this.academy.find();
            return Result;
        } catch (error) {
            throw new InternalServerErrorException('Internal server error');
        }
    }

    async insertAcademy(academyDTO: AcademyDTO): Promise<AcademyResponseDTO> {
        const checkCode: Academy = await this.academy.findOne({
            where: {code: academyDTO.code}});
        const checkPhone: Academy = await this.academy.findOne({
            where: {phone: academyDTO.phone}});
        if (checkCode) throw new BadRequestException('Code has been use');
        if (checkPhone) throw new BadRequestException('Phone has been use');
        try {
            const academy: Academy = await this.academy.save(academyDTO);
            return academy;
        } catch (error) {
            Logger.error(error);
            throw new InternalServerErrorException('Internal server error');
        }
    }

    async getAcademy(id: number): Promise<AcademyResponseDTO> {
        const academy: Academy = await this.academy.findOne(id);
        if (!academy) throw new NotFoundException('Academy not Found');
        try {
            return academy;
        } catch (error) {
            throw new InternalServerErrorException('Internal server error');
        }
    }

    async update(id: number, academyDTO: AcademyDTO): Promise<AcademyResponseDTO> {
        let academy: Academy = await this.academy.findOne({where: {id}});
        if (!academy) throw new NotFoundException('Academy not found');
        try {
            academy = this.academy.merge(academy, academyDTO);
            const updateAcademy: Academy = await this.academy.save(academy);
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
