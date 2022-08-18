import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tpsNumberFormatter'
})
export class TpsNumberFormatterPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    if (value) {
      const data = value.toString().split('.')[1];
      return data && data.length > 1 ? value.toFixed(2) : (data ? value : value.toFixed(1));
    } else {
      return null;
    }
  }

}
