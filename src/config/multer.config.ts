import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';
import md5 = require('md5');
import { parse } from 'path';

// Multer configuration
export const multerConfig: any = {
    dest: process.env.UPLOAD_LOCATION,
};

// Multer upload options
export const multerOptions: any = {
    // Enable file size limits
    limits: {
        fileSize: +process.env.MAX_FILE_SIZE,
    },
    // Check the mimetypes to allow for upload
    fileFilter: (req: any, file: any, cb: any): any => {
        console.log(`filtering file for account_id = ${req.user.id}`);
        if (file.mimetype.match(/\/(vnd.openxmlformats-officedocument.wordprocessingml.document|pdf|jpg|jpeg|msword)$/)) cb(null, true);
        else cb(new HttpException('Unsupported file type.', HttpStatus.BAD_REQUEST), false);
    },
    // Storage properties
    storage: diskStorage({
        // Destination storage path details
        destination: (req: any, file: any, cb: any): any => {
            const { id } = req.user;

            const uploadPath: string = multerConfig.dest + `/candidates/${id}/`;
            // Create folder if doesn't exist
            if (!existsSync(uploadPath)) mkdirSync(uploadPath);
            console.log(`creating directory for file ${file.filename}`);

            cb(null, uploadPath);
        },
        // File modification details

        filename: (req: any, file: { filename: string, originalname: string }, cb: any): any => {
            // Calling the callback passing the random name generated with the original extension name
            const { name: filename, ext } = parse(file.originalname);
            file.originalname = `${filename.replace(/[_. ]/g, '-').toLowerCase()}` + `${ext}`;
            file.filename = `${md5(filename)}${ext}`;
            console.log(`process uploading file with account_id = ${req.user.id}`);

            cb(null, file.filename);
        },
    }),
};
