import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { CartItem } from 'libs/models/cart.model';
import { ConfirmDialogComponent } from 'libs/shared/components/confirm-dialog/confirm-dialog.component';
import { QuantitySelectorComponent } from 'libs/shared/components/quantity-selector/quantity-selector.component';
import { IconColorPipe } from 'libs/shared/pipes/icon-color-pipe';
import { IconPipe } from 'libs/shared/pipes/icon-pipe';

@Component({
  selector: 'app-cart-item',
  imports: [
    IconPipe,
    IconColorPipe,
    QuantitySelectorComponent,
    CurrencyPipe,
    TranslatePipe,
  ],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemComponent {
  private readonly dialog = inject(MatDialog);

  @Input({ required: true }) item!: CartItem;
  @Input({ required: true }) currency!: string;

  @Output() removeItem = new EventEmitter<number>();
  @Output() quantityChange = new EventEmitter<{
    variantId: number;
    quantity: number;
  }>();

  onQuantityChange(item: CartItem, quantity: number): void {
    if (item.variantId != null && quantity != null) {
      this.quantityChange.emit({
        variantId: item.variantId,
        quantity,
      });
    }
  }

  onRemoveItem(variantId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '520px',
      maxWidth: '90vw',
      data: {
        title: 'cart.item.removeDialog.title',
        message: 'cart.item.removeDialog.message',
        cancel: 'cart.item.removeDialog.cancel',
        proceed: 'cart.item.removeDialog.proceed',
        name: this.item.productName,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res === 'proceed') {
        if (variantId != null) {
          this.removeItem.emit(variantId);
        }
      }
    });
  }
}
