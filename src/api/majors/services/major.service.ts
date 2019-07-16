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
        const result: Major[] = await this.majorRepository.find();
        try {
            return result;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async insertMajor(majorDTO: MajorDTO): Promise<MajorResponseDTO> {
        try {
            const major: Major = await this.majorRepository.save(majorDTO);
            return major;
        } catch (error) {
            Logger.error(error);
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async getDetailMajor(id: number): Promise<MajorResponseDTO> {
        const major: Major = await this.majorRepository.findOne(id);
        if (!major) throw new NotFoundException(`Major with id: ${id} Not Found`);
        try {
            return major;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async update(id: number, majorDTO: MajorDTO): Promise<MajorResponseDTO> {
        let major: Major = await this.majorRepository.findOne({where: {id}});
        if (!major) throw new NotFoundException(`Major with id: ${id} Not Found`);
        try {
            major = this.majorRepository.merge(major, majorDTO);
            const updateMajor: Major  = await this.majorRepository.save(major);
            return updateMajor;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async delete(id: number): Promise<DeleteResult> {
        const major: boolean = await this.majorRepository.count({id}) >  0;
        if (!major) throw new NotFoundException(`Major with id: ${id} Not Found`);
        try {
            const removeMajor: DeleteResult = await this.majorRepository.delete(id);
            return removeMajor;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }
}
