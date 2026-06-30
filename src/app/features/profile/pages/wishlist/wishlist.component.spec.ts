import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { WishlistService } from 'src/app/features/profile/services/wishlist.service';
import providers from 'src/test-providers';

import { WishlistComponent } from './wishlist.component';

describe('WishlistComponent', () => {
  let component: WishlistComponent;
  let fixture: ComponentFixture<WishlistComponent>;
  let loadWishlist: ReturnType<typeof vi.fn>;
  let removeProduct: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    loadWishlist = vi.fn();
    removeProduct = vi.fn();
    const wishlistService = {
      wishlist$: of({ count: 0, items: [] }),
      loading$: of(false),
      error$: of(null),
      mutatingProductIds$: of(new Set<number>()),
      loadWishlist,
      removeProduct,
    };

    await TestBed.configureTestingModule({
      imports: [WishlistComponent],
      providers: [
        ...providers,
        {
          provide: WishlistService,
          useValue: wishlistService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads the wishlist on init', () => {
    expect(loadWishlist).toHaveBeenCalled();
  });
});
