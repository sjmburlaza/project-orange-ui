import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryIcon',
})
export class CategoryIconPipe implements PipeTransform {
  private readonly icons: Record<string, string> = {
    Phones: 'bi bi-phone',
    Laptops: 'bi bi-laptop',
    Accessories: 'bi bi-keyboard',
  };

  transform(category: string | null | undefined): string {
    return this.icons[category ?? ''] || 'bi bi-box';
  }
}
