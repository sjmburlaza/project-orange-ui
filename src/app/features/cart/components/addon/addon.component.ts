import { Component, Input } from '@angular/core';
import { Addon } from 'src/app/core/models/cart.model';

@Component({
  selector: 'app-addon',
  imports: [],
  templateUrl: './addon.component.html',
  styleUrl: './addon.component.scss',
})
export class AddonComponent {
  @Input() addon!: Addon;
}
