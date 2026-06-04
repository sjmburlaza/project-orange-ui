import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  Addon,
  UpdateCartItemAddonRequest,
} from 'src/app/core/models/cart.model';
import { IconPipe } from 'src/app/shared/pipes/icon-pipe';
import { AddonInsuranceComponent } from '../addon-insurance/addon-insurance.component';
import { AddonTradeinComponent } from '../addon-tradein/addon-tradein.component';
import { AddonMobilePlanComponent } from '../addon-mobile-plan/addon-mobile-plan.component';
import { AddonDialogData } from './addon-dialog-data.model';
import { TranslatePipe } from '@ngx-translate/core';

interface UpsertAddonEvent {
  productId: number;
  addonId: string;
  request: UpdateCartItemAddonRequest;
}

interface RemoveAddonEvent {
  productId: number;
  addonId: string;
}

@Component({
  selector: 'app-addon',
  imports: [IconPipe, TranslatePipe],
  templateUrl: './addon.component.html',
  styleUrl: './addon.component.scss',
})
export class AddonComponent {
  @Input({ required: true }) addon!: Addon;
  @Input({ required: true }) productId!: number;
  @Output() upsertAddon = new EventEmitter<UpsertAddonEvent>();
  @Output() removeAddon = new EventEmitter<RemoveAddonEvent>();

  readonly dialog = inject(MatDialog);

  openAddonDialog(addonId: string): void {
    if (!addonId) return;

    const data: AddonDialogData = {
      productId: this.productId,
      addon: this.addon,
    };
    let dialogRef;

    switch (addonId) {
      case 'insurance':
        dialogRef = this.dialog.open(AddonInsuranceComponent, {
          data,
        });
        break;
      case 'trade-in':
        dialogRef = this.dialog.open(AddonTradeinComponent, {
          data,
        });
        break;
      case 'mobile-plan':
        dialogRef = this.dialog.open(AddonMobilePlanComponent, {
          data,
        });
        break;
    }

    dialogRef
      ?.afterClosed()
      .subscribe((request?: UpdateCartItemAddonRequest) => {
        if (!request) return;

        this.upsertAddon.emit({
          productId: this.productId,
          addonId,
          request,
        });
      });
  }

  removeSelectedAddon(): void {
    this.removeAddon.emit({
      productId: this.productId,
      addonId: this.addon.id,
    });
  }
}
