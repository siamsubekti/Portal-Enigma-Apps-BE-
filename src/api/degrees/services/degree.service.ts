import { Injectable, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Degree from '../models/degree.entity';
import { Repository, DeleteResult } from 'typeorm';
import { DegreeResponseDTO, DegreeDTO, DegreeResponse } from '../models/degree.dto';

@Injectable()
export class DegreeService {
    constructor(
        @InjectRepository(Degree)
        private readonly degreeRepository: Repository<Degree>,
    ) {}

    async getDegrees(): Promise<DegreeResponseDTO[]> {
        try {
        const Degrees = await this.degreeRepository.find();
        return Degrees;
        } catch (error) {
            throw new InternalServerErrorException('Internal server Error');
        }
    }

    async getDegree(id: number): Promise<DegreeResponseDTO> {
        const Data: Degree = await this.degreeRepository.findOne(id);
        Logger.log(Data);
        if (!Data) throw new NotFoundException('Degree Not Found');
        try {
            return Data;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async insertDegree(data: DegreeDTO): Promise<DegreeResponseDTO> {
        try {
            const degree = this.degreeRepository.save(data);
            return degree;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async updateDegree(id: number, degreeDTO: DegreeDTO): Promise<DegreeResponseDTO> {
        let degree: Degree = await this.degreeRepository.findOne({where: {id}});
        if (!degree) throw new NotFoundException('Degree Not Found');
        try {
            degree = this.degreeRepository.merge(degree, degreeDTO);
            const updateDegree = await this.degreeRepository.save(degree);
            return updateDegree;
        } catch (error) {
            throw new InternalServerErrorException('Internal server error');
        }
    }

    async deleteDegree(id: number): Promise<DeleteResult> {
        const countId = await this.degreeRepository.count({id}) > 0;
        if (!countId) throw new NotFoundException('Id Not Found');
        try {
            const result: DeleteResult = await this.degreeRepository.delete(id);
            return result;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }
}
