import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartItemComponent } from './cart-item.component';

describe('CartItemComponent', () => {
  let component: CartItemComponent;
  let fixture: ComponentFixture<CartItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartItemComponent);
    component = fixture.componentInstance;
    component.item = {
      productId: 1,
      variantId: 1001,
      productName: 'Orange Phone',
      price: 699,
      quantity: 1,
      totalPrice: 699,
      stockQuantity: 5,
      imageUrl: '',
      categoryName: 'phones',
      itemSpecs: [{ name: 'Storage', value: '128GB' }],
      addons: [],
    };
    component.currency = 'USD';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
