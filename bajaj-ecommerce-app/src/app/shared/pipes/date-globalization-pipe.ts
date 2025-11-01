import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateGlobalization'
})
export class DateGlobalizationPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
