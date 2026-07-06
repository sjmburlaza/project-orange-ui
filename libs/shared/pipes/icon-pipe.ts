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
    keyboard: 'bi bi-keyboard',
    mouse: 'bi bi-mouse',
    earbuds: 'bi bi-earbuds',
    headphones: 'bi bi-headphones',
    headset: 'bi bi-headset',
    insurance: 'bi bi-shield-check',
    'mobile-plan': 'bi bi-sim',
    'trade-in': 'bi bi-arrow-repeat',
    delete: 'bi bi-trash',
    add: 'bi bi-plus-lg',
    cart: 'bi bi-cart2',
  };

  transform(category: string | null | undefined): string {
    const lc = category?.toLowerCase();

    return this.icons[lc ?? ''] || 'bi bi-box';
  }
}
