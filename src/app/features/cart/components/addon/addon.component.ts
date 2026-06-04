import { Component, inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Addon } from 'src/app/core/models/cart.model';
import { IconPipe } from 'src/app/shared/pipes/icon-pipe';
import { AddonInsuranceComponent } from '../addon-insurance/addon-insurance.component';
import { AddonTradeinComponent } from '../addon-tradein/addon-tradein.component';
import { AddonMobilePlanComponent } from '../addon-mobile-plan/addon-mobile-plan.component';

@Component({
  selector: 'app-addon',
  imports: [IconPipe],
  templateUrl: './addon.component.html',
  styleUrl: './addon.component.scss',
})
export class AddonComponent {
  @Input() addon!: Addon;
  readonly dialog = inject(MatDialog);

  openAddon(addon: string) {
    if (!addon) return;

    let dialogRef;

    switch (addon) {
      case 'insurance':
        dialogRef = this.dialog.open(AddonInsuranceComponent, {
          data: addon,
        });
        break;
      case 'trade-in':
        dialogRef = this.dialog.open(AddonTradeinComponent, {
          data: addon,
        });
        break;
      case 'mobile-plan':
        dialogRef = this.dialog.open(AddonMobilePlanComponent, {
          data: addon,
        });
        break;
    }

    dialogRef?.afterClosed().subscribe((res) => {
      console.log(res);
    });
  }
}
