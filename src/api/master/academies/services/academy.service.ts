import { Repository, DeleteResult, SelectQueryBuilder } from 'typeorm';
import { Injectable, Logger, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Academy from '../models/academy.entity';
import { AcademyDTO, AcademiesQueryDTO, AcademiesQueryResult } from '../models/academy.dto';

@Injectable()
export default class AcademyService {
    constructor(
    @InjectRepository(Academy)
    private readonly academyRepository: Repository<Academy>,
    ) {}

    async all(queryParams: AcademiesQueryDTO): Promise<AcademiesQueryResult> {
        let query: SelectQueryBuilder<Academy> = this.academyRepository.createQueryBuilder('a').select('a');

        if (queryParams.term) {
          let { term } = queryParams;
          term = `%${term}%`;
          query = query
            .orWhere('a.code LIKE :term', { term })
            .orWhere('a.name LIKE :term', { term })
            .orWhere('a.phone LIKE :term', { term })
            .orWhere('a.type LIKE :term', { term });
        }

        if (queryParams.order && queryParams.sort) {
          const sort: 'ASC' | 'DESC' = queryParams.sort.toUpperCase() as 'ASC' | 'DESC';
          const orderCols: { [key: string]: string } = {
            code: 'a.code',
            name: 'a.name',
            phone: 'a.phone',
            type: 'a.type',
          };

          query = query.orderBy( orderCols[ queryParams.order ], sort );
        } else
          query = query.orderBy( 'a.name', 'ASC' );

        query.offset( queryParams.page > 1 ? ( queryParams.rowsPerPage * queryParams.page ) + 1 : 0 );
        query.limit( queryParams.rowsPerPage );

        const result: [ Academy[], number ] = await query.getManyAndCount();

        return {
          result: result[0],
          totalRows: result[1],
        };
    }

    async insert(academyDTO: AcademyDTO): Promise<Academy> {
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

    async get(id: number): Promise<Academy> {
        const academy: Academy = await this.academyRepository.findOne(id);
        if (!academy) throw new NotFoundException(`Academy with id: ${id} Not Found`);
        try {
            return academy;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async update(id: number, academyDTO: AcademyDTO): Promise<Academy> {
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
