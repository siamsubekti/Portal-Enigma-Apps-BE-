import { Injectable, NotFoundException } from '@nestjs/common';
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

    async getFilenameByPath(path: string): Promise<Document> {
        const file: Document = await this.document.findOne({ where: { filepath: path } });
        if (!file) throw new NotFoundException('Path not found.');
        else return file;
    }

    // async getFile(document: DocumentDTO): Promise<Buffer> {
    //     const filename = document.name;
    //     const filepath = document.filepath;

    //     const pdf = await new Promise<Buffer>((resolve, reject) => {
    //       fs.readFile(filepath, {}, (err, data) => {
    //         if (err) reject(err)
    //         else resolve(data)
    //       })
    //     })
    //     return pdf
    //   }

}
