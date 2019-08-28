import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Document from '../models/document.entity';
import { Repository } from 'typeorm';
import { DocumentDTO } from '../models/document.dto';

@Injectable()
export default class DocumentService {

    constructor(@InjectRepository(Document)
    private readonly document: Repository<Document>,
    ) { }

    async findAll(): Promise<Document[]> {
        return this.document.find();
    }

    async find(documentId: string): Promise<Document> {
        return this.document.findOne({ where: { id: documentId } });
    }

    async create(documentDto: DocumentDTO): Promise<Document> {
        return this.document.save(documentDto);
    }

    async findByAccountIdAndName(accountId: string, name: string): Promise<Document> {
        return await this.document.findOne({ accountId, name });
    }

    async getFilenameByPath(filepath: string): Promise<Document> {
        return await this.document.findOne({ filepath });
    }

    async findByAccountId(accountId: string): Promise<Document[]> {
        return this.document.find({ accountId });
    }
}
