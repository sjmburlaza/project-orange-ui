import { AsyncPipe, CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { distinctUntilChanged, filter, map, tap } from 'rxjs';
import { Cart } from 'src/app/core/models/cart.model';
import {
  ProductConfigure,
  ProductOption,
  ProductOptionGroup,
  ProductVariant,
} from 'src/app/core/models/product.model';
import { SiteService } from 'src/app/core/services/site.services';
import { CartFacade } from 'src/app/features/cart/store/cart.facade';
import {
  CarouselComponent,
  CarouselItemDirective,
} from 'src/app/shared/components/carousel/carousel.component';
import { IconPipe } from 'src/app/shared/pipes/icon-pipe';

interface RecommendedProductState {
  selectedOptions: Record<string, string>;
}

@Component({
  selector: 'app-recommended-products',
  imports: [
    AsyncPipe,
    CarouselComponent,
    CarouselItemDirective,
    CurrencyPipe,
    IconPipe,
    MatButtonModule,
    TranslatePipe,
  ],
  templateUrl: './recommended-products.component.html',
  styleUrl: './recommended-products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendedProductsComponent implements OnInit {
  private readonly cartFacade = inject(CartFacade);
  private readonly destroyRef = inject(DestroyRef);
  private productStates: Record<number, RecommendedProductState> = {};
  private products: ProductConfigure[] = [];
  readonly visibleProductCount = 3;
  readonly siteService = inject(SiteService);
  readonly recommendedProducts$ = this.cartFacade.recommendedProducts$.pipe(
    tap((products) => this.setProducts(products)),
  );

  ngOnInit(): void {
    this.watchRecommendedProductsRefresh();
  }

  selectOption(
    product: ProductConfigure,
    groupCode: string,
    option: ProductOption,
  ): void {
    if (!this.isOptionAvailable(product, groupCode, option.code)) {
      return;
    }

    const state = this.getProductState(product);

    this.setProductState(product.id, {
      selectedOptions: {
        ...state.selectedOptions,
        [groupCode]: option.code,
      },
    });
  }

  isOptionSelected(
    product: ProductConfigure,
    groupCode: string,
    optionCode: string,
  ): boolean {
    return this.getProductState(product).selectedOptions[groupCode] === optionCode;
  }

  isOptionAvailable(
    product: ProductConfigure,
    groupCode: string,
    optionCode: string,
  ): boolean {
    const selectedOptions = {
      ...this.getProductState(product).selectedOptions,
      [groupCode]: optionCode,
    };

    return this.getProductVariants(product).some(
      (variant) =>
        variant.stockQuantity > 0 &&
        this.variantMatches(variant, selectedOptions),
    );
  }

  addProduct(product: ProductConfigure): void {
    const variant = this.getSelectedVariant(product);

    if (!variant || variant.stockQuantity <= 0) {
      return;
    }

    this.cartFacade.addToCart({
      variantId: variant.id,
      quantity: 1,
      addons: [],
    });
  }

  getProductOptionGroups(product: ProductConfigure): ProductOptionGroup[] {
    return product.optionGroups ?? [];
  }

  getProductImageUrl(product: ProductConfigure): string {
    return this.getSelectedVariant(product)?.imageUrl || product.imageUrl;
  }

  getProductPrice(product: ProductConfigure): number {
    return this.getSelectedVariant(product)?.price ?? product.price;
  }

  canAddProduct(product: ProductConfigure): boolean {
    const variant = this.getSelectedVariant(product);

    return variant !== null && variant.stockQuantity > 0;
  }

  getSelectedColorHex(product: ProductConfigure): string | null {
    const selectedColor = this.getProductState(product).selectedOptions['color'];
    const colorOption = this.getProductOptionGroups(product)
      .find((group) => group.code === 'color')
      ?.options.find((option) => option.code === selectedColor);

    return colorOption?.hex ?? null;
  }

  private setProducts(value: ProductConfigure[] | null): void {
    this.products = value ?? [];
    this.initializeProductStates();
  }

  private watchRecommendedProductsRefresh(): void {
    this.cartFacade.cart$
      .pipe(
        map((cart) => this.getRecommendedProductsRefreshKey(cart)),
        filter((key): key is string => key !== null),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.cartFacade.loadRecommendedProducts();
      });
  }

  private getRecommendedProductsRefreshKey(cart: Cart | null): string | null {
    if (!cart || cart.entries.length === 0) {
      return null;
    }

    const itemKey = cart.entries
      .map((item) => `${item.variantId}:${item.quantity}`)
      .join('|');

    return `${cart.code}:${itemKey}`;
  }

  private initializeProductStates(): void {
    const nextStates = this.products.reduce<
      Record<number, RecommendedProductState>
    >((states, product) => {
      states[product.id] =
        this.productStates[product.id] ?? this.createInitialState(product);

      return states;
    }, {});

    this.productStates = nextStates;
  }

  private createInitialState(
    product: ProductConfigure,
  ): RecommendedProductState {
    const firstAvailableVariant =
      this.getProductVariants(product).find((variant) => variant.stockQuantity > 0) ??
      this.getProductVariants(product)[0] ??
      null;

    return {
      selectedOptions: firstAvailableVariant
        ? { ...firstAvailableVariant.options }
        : this.getDefaultOptions(product),
    };
  }

  private getDefaultOptions(product: ProductConfigure): Record<string, string> {
    return this.getProductOptionGroups(product).reduce<Record<string, string>>(
      (options, group) => {
        const firstOption = group.options[0];

        return firstOption
          ? {
              ...options,
              [group.code]: firstOption.code,
            }
          : options;
      },
      {},
    );
  }

  private getProductState(product: ProductConfigure): RecommendedProductState {
    const state = this.productStates[product.id];

    if (state) {
      return state;
    }

    const nextState = this.createInitialState(product);
    this.setProductState(product.id, nextState);

    return nextState;
  }

  private setProductState(
    productId: number,
    state: RecommendedProductState,
  ): void {
    this.productStates = {
      ...this.productStates,
      [productId]: state,
    };
  }

  private getProductVariants(product: ProductConfigure): ProductVariant[] {
    return product.variants ?? [];
  }

  private getSelectedVariant(product: ProductConfigure): ProductVariant | null {
    const selectedOptions = this.getProductState(product).selectedOptions;

    return (
      this.getProductVariants(product).find(
        (variant) =>
          variant.stockQuantity > 0 &&
          this.variantMatches(variant, selectedOptions),
      ) ??
      this.getProductVariants(product).find((variant) =>
        this.variantMatches(variant, selectedOptions),
      ) ??
      null
    );
  }

  private variantMatches(
    variant: ProductVariant,
    selectedOptions: Record<string, string>,
  ): boolean {
    return Object.entries(selectedOptions).every(
      ([groupCode, optionCode]) =>
        variant.options[groupCode]?.toLowerCase() === optionCode.toLowerCase(),
    );
  }
}
