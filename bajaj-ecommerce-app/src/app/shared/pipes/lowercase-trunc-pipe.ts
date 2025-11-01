import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lowercaseTrunc'
})
export class LowercaseTruncPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
