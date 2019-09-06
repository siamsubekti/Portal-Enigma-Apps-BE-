import * as md5 from 'md5';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { parse, join } from 'path';
import AppConfig from './app.config';

const config: AppConfig = new AppConfig();

// Multer configuration
export const multerConfig: any = {
  dest: config.get('UPLOAD_LOCATION'),
};

// Multer upload options
export const multerOptions: any = {
  // Enable file size limits
  limits: {
    fileSize: +config.get('MAX_FILE_SIZE'),
  },
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any): any => {
    Logger.log(`filtering file for account_id = ${req.user.id}`, 'multerConfig@options', true);
    if (file.mimetype.match(/\/(vnd.openxmlformats-officedocument.wordprocessingml.document|pdf|jpg|jpeg|msword)$/)) cb(null, true);
    else cb(new HttpException('Unsupported file type.', HttpStatus.BAD_REQUEST), false);
  },
  // Storage properties
  storage: diskStorage({
    // Destination storage path details
    destination: (req: any, file: any, cb: any): any => {
      const { id } = req.user;

      const uploadPath: string = join(multerConfig.dest, 'documents', 'candidates', md5(id));
      // Create folder if doesn't exist
      if (!existsSync(uploadPath)) {
        mkdirSync(join(config.get('BASE_PATH'), uploadPath), { recursive: true });
        Logger.log(`creating directory ${uploadPath}/${file}`, 'multerConfig@options', true);
      }

      cb(null, uploadPath);
    },
    // File modification details

    filename: (req: any, file: { filename: string, originalname: string }, cb: any): any => {
      // Calling the callback passing the random name generated with the original extension name
      const { name: filename, ext } = parse(file.originalname);
      file.originalname = `${filename.replace(/[_. ]/g, '-').toLowerCase()}${ext}`;
      file.filename = `${md5(filename)}${ext}`;
      Logger.log(`process uploading file with account_id = ${req.user.id}`);

      cb(null, file.filename);
    },
  }),
};
