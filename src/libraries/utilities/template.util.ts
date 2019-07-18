import * as hbs from 'express-handlebars';
import { join, normalize } from 'path';
import { Injectable, Logger } from '@nestjs/common';
import AppConfig from '../../config/app.config';

@Injectable()
export default class TemplateUtil {
  private engine: any;

  constructor(private readonly config: AppConfig) {
    this.configure();
  }

  private configure(): void {
    this.engine = hbs.create(this.config.viewEngine());
  }

  async renderToString(viewPath: string, data: any): Promise<string> {
    viewPath = join(this.config.get('SRC_PATH'), 'views', viewPath);
    viewPath = normalize(viewPath);

    Logger.log(`Render: ${viewPath}`, 'TemplateUtil @renderToString', true);
    return await this.engine.render(viewPath, data);
  }
}
