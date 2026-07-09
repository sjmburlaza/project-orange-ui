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
      reviewRating: 3.5,
      reviewCount: 128,
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

  it('renders available colors', () => {
    const element = fixture.nativeElement as HTMLElement;
    const colors = element.querySelector('.product__colors');
    const swatches = colors?.querySelectorAll('.product__color');

    expect(colors?.querySelector('.product__colors-label')).toBeTruthy();
    expect(swatches).toHaveLength(2);
    expect(swatches?.[0].getAttribute('aria-label')).toBe('Black');
    expect(swatches?.[1].getAttribute('aria-label')).toBe('Blue');
  });

  it('renders the product review rating', () => {
    const rating = fixture.nativeElement.querySelector(
      '.product__rating',
    ) as HTMLElement | null;

    const stars = rating?.querySelectorAll('.product__rating-star');

    expect(rating?.textContent).toContain('3.5');
    expect(rating?.getAttribute('aria-label')).toBeTruthy();
    expect(stars).toHaveLength(5);
    expect(rating?.querySelectorAll('.bi-star-fill')).toHaveLength(3);
    expect(rating?.querySelectorAll('.bi-star-half')).toHaveLength(1);
    expect(rating?.querySelectorAll('.bi-star')).toHaveLength(1);
    expect(
      rating?.querySelectorAll('.product__rating-star--colored'),
    ).toHaveLength(4);
    expect(
      rating?.querySelector('.product__reviews-link')?.textContent?.trim(),
    ).toBe('(128)');
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
