import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { Router } from '@angular/router';
import { SiteService } from 'src/app/core/services/site.services';
import { CartFacade } from 'src/app/features/cart/store/cart.facade';

@Component({
  selector: 'app-header',
  imports: [MatBadgeModule, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private readonly cartFacade = inject(CartFacade);
  private readonly router = inject(Router);
  readonly siteService = inject(SiteService);
  readonly itemCount$ = this.cartFacade.itemCount$;
  readonly site = this.siteService.currentSite();

  ngOnInit(): void {
    this.cartFacade.loadCart();
  }

  goToCart(): void {
    this.router.navigate([`/${this.site}/cart`]);
  }

  goToProducts(): void {
    this.router.navigate([`/${this.site}/products`]);
  }
}
