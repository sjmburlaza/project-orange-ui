import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-cod-payment-method',
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './cod-payment-method.component.html',
  styleUrl: './cod-payment-method.component.scss',
})
export class CodPaymentMethodComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) detailKey = '';
  @Input() icon?: string;
  @Input() selected = false;

  @Output() methodSelected = new EventEmitter<void>();
}
