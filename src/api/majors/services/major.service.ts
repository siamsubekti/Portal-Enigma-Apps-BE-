import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Major from '../models/major.entity';
import { Repository, DeleteResult } from 'typeorm';
import { MajorResponseDTO, MajorDTO } from '../models/major.dto';

@Injectable()
export class MajorService {
    constructor(
        @InjectRepository(Major)
        private readonly majorRepository: Repository<Major>,
    ) {}

    async getMajors(): Promise<MajorResponseDTO[]>  {
        try {
            const Result = await this.majorRepository.find();
            return Result;
        } catch (error) {
            throw new InternalServerErrorException('Internal server error');
        }
    }

    async insertMajor(majorDTO: MajorDTO): Promise<MajorResponseDTO> {
        try {
            const data = await this.majorRepository.save(majorDTO);
            return data;
        } catch (error) {
            Logger.error(error);
            throw new InternalServerErrorException('Internal server error');
        }
    }

    async getDetailMajor(id: number): Promise<MajorResponseDTO> {
        const data: Major = await this.majorRepository.findOne(id);
        if (!data) throw new NotFoundException('Major not Found');
        try {
            return data;
        } catch (error) {
            throw new InternalServerErrorException('Internal server error');
        }
    }

    async update(id: number, majorDTO: MajorDTO): Promise<MajorResponseDTO> {
        let data: Major = await this.majorRepository.findOne({where: {id}});
        if (!data) throw new NotFoundException('Academy not found');
        try {
            data = this.majorRepository.merge(data, majorDTO);
            const updateAcademy = await this.majorRepository.save(data);
            return updateAcademy;
        } catch (error) {
            throw new InternalServerErrorException('Internal server error');
        }
    }

    async delete(id: number): Promise<DeleteResult> {
        const academy: boolean = await this.majorRepository.count({id}) >  0;
        if (!academy) throw new NotFoundException('Academy not found');
        try {
            const removeAcademy: DeleteResult = await this.majorRepository.delete(id);
            return removeAcademy;
        } catch (error) {
            throw new InternalServerErrorException('Internal server error');
        }
    }
}
