import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { CartFacade } from 'src/app/features/cart/store/cart.facade';

@Component({
  selector: 'app-header',
  imports: [MatBadgeModule, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private readonly cartFacade = inject(CartFacade);
  readonly itemCount$ = this.cartFacade.itemCount$;

  ngOnInit(): void {
    this.cartFacade.loadCart();
  }
}
