import { Injectable, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Degree from '../models/degree.entity';
import { Repository, DeleteResult } from 'typeorm';
import { DegreeResponseDTO, DegreeDTO } from '../models/degree.dto';

@Injectable()
export class DegreeService {
    constructor(
        @InjectRepository(Degree)
        private readonly degreeRepository: Repository<Degree>,
    ) {}

    async getDegrees(): Promise<DegreeResponseDTO[]> {
        const degrees: Degree[] = await this.degreeRepository.find();
        try {
        return degrees;
        } catch (error) {
            throw new InternalServerErrorException('Internal server Error');
        }
    }

    async getDegree(id: number): Promise<DegreeResponseDTO> {
        const degree: Degree = await this.degreeRepository.findOne(id);
        Logger.log(degree);
        if (!degree) throw new NotFoundException(`Degree with id: ${id} Not Found`);
        try {
            return degree;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async insertDegree(degreeDTO: DegreeDTO): Promise<DegreeResponseDTO> {
        try {
            const degree: Degree = await this.degreeRepository.create(degreeDTO);
            return degree;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async updateDegree(id: number, degreeDTO: DegreeDTO): Promise<DegreeResponseDTO> {
        let degree: Degree = await this.degreeRepository.findOne({where: {id}});
        if (!degree) throw new NotFoundException(`Degree with id: ${id} Not Found`);
        try {
            degree = this.degreeRepository.merge(degree, degreeDTO);
            const updateDegree: Degree = await this.degreeRepository.save(degree);
            return updateDegree;
        } catch (error) {
            throw new InternalServerErrorException('Internal server error');
        }
    }

    async deleteDegree(id: number): Promise<DeleteResult> {
        const countId: boolean = await this.degreeRepository.count({id}) > 0;
        if (!countId) throw new NotFoundException(`Degree with id: ${id} Not Found`);
        try {
            const result: DeleteResult = await this.degreeRepository.delete(id);
            return result;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }
}
