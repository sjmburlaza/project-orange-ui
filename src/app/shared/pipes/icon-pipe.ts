import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'icon',
})
export class IconPipe implements PipeTransform {
  private readonly icons: Record<string, string> = {
    phones: 'bi bi-phone',
    laptops: 'bi bi-laptop',
    accessories: 'bi bi-keyboard',
    monitors: 'bi bi-display',
    insurance: 'bi bi-shield-check',
    'mobile-plan': 'bi bi-sim',
    'trade-in': 'bi bi-arrow-repeat',
    delete: 'bi bi-trash',
    add: 'bi bi-plus-lg',
  };

  transform(category: string | null | undefined): string {
    const lc = category?.toLowerCase();

    return this.icons[lc ?? ''] || 'bi bi-box';
  }
}
