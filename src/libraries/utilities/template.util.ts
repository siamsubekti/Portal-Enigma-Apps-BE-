import * as hbs from 'express-handlebars';
import { existsSync } from 'fs';
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

  async renderToString(view: string, data: any): Promise<string> {
    view = join(this.config.get('BASE_PATH'), 'views', view);
    view = normalize(view);

    Logger.log(`Render: ${view}`, 'TemplateUtil @renderToString', true);
    if (!existsSync(view)) throw new Error(`File not found ${view}.`);

    return await this.engine.render(view, data);
  }
}
