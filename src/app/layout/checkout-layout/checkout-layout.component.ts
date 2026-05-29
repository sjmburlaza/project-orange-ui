import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CartFacade } from 'src/app/features/cart/store/cart.facade';
import { FooterComponent } from 'src/app/layout/footer/footer.component';
import { HeaderComponent } from 'src/app/layout/header/header.component';
import { SidebarComponent } from 'src/app/layout/sidebar/sidebar.component';

@Component({
  selector: 'app-checkout-layout',
  imports: [
    HeaderComponent,
    RouterOutlet,
    FooterComponent,
    SidebarComponent,
    AsyncPipe,
    TranslatePipe,
  ],
  templateUrl: './checkout-layout.component.html',
  styleUrl: './checkout-layout.component.scss',
})
export class CheckoutLayoutComponent {
  private readonly cartFacade = inject(CartFacade);
  readonly itemCount$ = this.cartFacade.itemCount$;
}
