import * as moment from 'moment';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class ValidatorUtil {
  validateDateBetween(start: moment.Moment, end: moment.Moment): boolean {
    const isValid: boolean = ( start.isValid() && end.isValid() );

    if (!isValid) return false;

    return isValid && end.isSameOrAfter(start);
  }
}
