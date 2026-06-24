import { Component, Input } from '@angular/core';

const ICON_MAP = {
  phones: 'assets/icons/phone.svg',
  laptops: 'assets/icons/laptop.svg',
  accessories: 'assets/icons/keyboard.svg',
  monitors: 'assets/icons/display.svg',
  insurance: 'assets/icons/shield-check.svg',
  'mobile-plan': 'assets/icons/sim.svg',
  'trade-in': 'assets/icons/arrow-repeat.svg',
  delete: 'assets/icons/trash.svg',
  add: 'assets/icons/plus-lg.svg',
  cart: 'assets/icons/cart2.svg',
} as const;

type IconName = keyof typeof ICON_MAP;
type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-icon',
  imports: [],
  template: ` <img [src]="iconPath" [alt]="name" [class]="size" /> `,
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  @Input({ required: true }) name!: IconName;
  @Input({ required: true }) size!: IconSize;

  get iconPath(): string {
    return ICON_MAP[this.name];
  }
}
