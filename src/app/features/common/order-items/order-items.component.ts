import { Component, inject } from '@angular/core';
import { CartFacade } from '../../cart/store/cart.facade';
import { SiteService } from 'src/app/core/services/site.services';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { IconPipe } from 'src/app/shared/pipes/icon-pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-order-items',
  imports: [AsyncPipe, IconPipe, CurrencyPipe, TranslatePipe],
  templateUrl: './order-items.component.html',
  styleUrl: './order-items.component.scss',
})
export class OrderItemsComponent {
  private readonly cartFacade = inject(CartFacade);
  readonly siteService = inject(SiteService);
  readonly items$ = this.cartFacade.items$;
  readonly itemCount$ = this.cartFacade.itemCount$;
  readonly currency = this.siteService.currency;
}
