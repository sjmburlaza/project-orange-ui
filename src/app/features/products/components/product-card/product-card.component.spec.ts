import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardComponent } from './product-card.component';
import providers from 'src/test-providers';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers,
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = {
      id: 1,
      name: 'Orange Phone',
      description: 'A compact storefront test product.',
      price: 699,
      stockQuantity: 5,
      imageUrl: '',
      categoryId: 1,
      categoryName: 'phones',
      availableColors: [
        { code: 'black', label: 'Black', hex: '#111111' },
        { code: 'blue', label: 'Blue', hex: '#2563eb' },
      ],
    };
    component.currency = 'USD';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders available colors below the description', () => {
    const element = fixture.nativeElement as HTMLElement;
    const colors = element.querySelector('.product__colors');
    const content = element.textContent ?? '';

    expect(colors?.textContent).toContain('Black');
    expect(colors?.textContent).toContain('Blue');
    expect(content.indexOf('A compact storefront test product.')).toBeLessThan(
      content.indexOf('Black'),
    );
  });

  it('emits when the wishlist button is clicked', () => {
    vi.spyOn(component.toggleWishlist, 'emit');

    fixture.nativeElement
      .querySelector('.product__wishlist')
      ?.dispatchEvent(new Event('click'));

    expect(component.toggleWishlist.emit).toHaveBeenCalledWith(
      component.product,
    );
  });
});
