import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailAttachment {
  filename: string;
  content?: any;
  path?: string;
  href?: string;
  httpHeaders?: any;
  contentType?: any;
  contentDisposition?: string;
  cid?: string;
  encoding?: string;
  headers?: any;
  raw?: string;
}

@Injectable()
export class EmailMessage {
  from: string;
  to: string;
  bc?: string;
  bcc?: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: EmailAttachment[];
}
