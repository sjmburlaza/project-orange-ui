import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { CartItem } from 'src/app/core/models/cart.model';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { QuantitySelectorComponent } from 'src/app/shared/components/quantity-selector/quantity-selector.component';
import { IconColorPipe } from 'src/app/shared/pipes/icon-color-pipe';
import { IconPipe } from 'src/app/shared/pipes/icon-pipe';

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
})
export class CartItemComponent {
  private readonly dialog = inject(MatDialog);

  @Input({ required: true }) item!: CartItem;
  @Input({ required: true }) currency!: string;

  @Output() removeItem = new EventEmitter<number>();
  @Output() quantityChange = new EventEmitter<{
    productId: number;
    quantity: number;
  }>();

  onQuantityChange(productId: number, quantity: number): void {
    if (productId != null && quantity != null) {
      this.quantityChange.emit({ productId, quantity });
    }
  }

  onRemoveItem(productId: number) {
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
        if (productId != null) {
          this.removeItem.emit(productId);
        }
      }
    });
  }
}
