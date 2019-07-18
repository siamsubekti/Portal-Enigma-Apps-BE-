import { Repository, DeleteResult } from 'typeorm';
import { Injectable, Logger, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Academy from '../models/academy.entity';
import { AcademyResponseDTO, AcademyDTO } from '../models/academy.dto';

@Injectable()
export class AcademyService {
    constructor(
    @InjectRepository(Academy)
    private readonly academyRepository: Repository<Academy>,
    ) {}

    async getAcademies(): Promise<AcademyResponseDTO[]>  {
        try {
            const Result: Academy[] = await this.academyRepository.find();
            return Result;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async insertAcademy(academyDTO: AcademyDTO): Promise<AcademyResponseDTO> {
        const checkCode: Academy = await this.academyRepository.findOne({
            where: {code: academyDTO.code}});
        const checkPhone: Academy = await this.academyRepository.findOne({
            where: {phone: academyDTO.phone}});
        if (checkCode) throw new BadRequestException('Code Has Been Use');
        if (checkPhone) throw new BadRequestException('Phone Has Been Use');
        try {
            const academy: Academy = await this.academyRepository.save(academyDTO);
            return academy;
        } catch (error) {
            Logger.error(error);
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async getAcademy(id: number): Promise<AcademyResponseDTO> {
        const academy: Academy = await this.academyRepository.findOne(id);
        if (!academy) throw new NotFoundException(`Academy with id: ${id} Not Found`);
        try {
            return academy;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async update(id: number, academyDTO: AcademyDTO): Promise<AcademyResponseDTO> {
        const academy: Academy = await this.academyRepository.findOne({where: {id}});
        if (!academy) throw new NotFoundException(`Academy with id: ${id} Not Found`);
        try {
            const data: Academy = this.academyRepository.merge(academy, academyDTO);
            const updateAcademy: Academy = await this.academyRepository.save(data);
            return updateAcademy;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async delete(id: number): Promise<DeleteResult> {
        const academy: boolean = await this.academyRepository.count({id}) >  0;
        if (!academy) throw new NotFoundException(`Academy with id: ${id} Not Found`);
        try {
            const removeAcademy: DeleteResult = await this.academyRepository.delete(id);
            return removeAcademy;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }
}
