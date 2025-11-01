import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lowercaseTrunc'
})
export class LowercaseTruncPipe implements PipeTransform {

  // Usage: {{ someValue | lowercaseTrunc }} -> first 4 chars lowercase
  //        {{ someValue | lowercaseTrunc:10 }} -> first 10 chars lowercase
  transform(value: string, length: string = '4'): string {
    if (!value) return '';
    const target = parseInt(length, 10);
    if (isNaN(target) || target <= 0) return value.toLowerCase();
    if (value.length <= target) return value.toLowerCase();
    return value.substring(0, target).toLowerCase();
  }

}
