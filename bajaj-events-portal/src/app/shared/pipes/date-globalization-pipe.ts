import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateGlobalization'
})
export class DateGlobalizationPipe implements PipeTransform {

  transform(value: string, ...args: string[]): string {
    if(!value) return value;
    let locale:string=args[0]?args[0]:'en-IN';
    return new Intl.DateTimeFormat(locale,{
      weekday:'long',
      year:'numeric',
      month:'long',
      day:'2-digit',
      hour:'2-digit',
      minute:'2-digit',
      dayPeriod:'short'
    }).format(new Date(value));
  }

}
