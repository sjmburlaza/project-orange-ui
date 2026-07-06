import { Pipe, PipeTransform } from '@angular/core';
import { ItemSpec } from 'libs/models/cart.model';

@Pipe({
  name: 'iconColor',
})
export class IconColorPipe implements PipeTransform {
  transform(specs: ItemSpec[] | null | undefined): string {
    if (!specs) return '';

    return specs?.find((s) => s.name.toLowerCase() === 'color')?.value || '';
  }
}
