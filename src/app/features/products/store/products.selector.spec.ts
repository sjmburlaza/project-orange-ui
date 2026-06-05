import {
  InsurancePlan,
  MobilePlan,
  Product,
  ProductDetail,
} from 'src/app/core/models/product.model';
import {
  selectInsurancePlansForProduct,
  selectMobilePlansForProduct,
  selectPriceRange,
  selectProductFilters,
  selectProductListWithStockStatus,
  selectSelectedProductDetail,
} from './products.selector';

describe('product selectors', () => {
  it('projects the selected product filters into an API-ready filter object', () => {
    expect(
      selectProductFilters.projector(3, 'name-asc', 1000, 5000),
    ).toEqual({
      categoryId: 3,
      sortBy: 'name-asc',
      minPrice: 1000,
      maxPrice: 5000,
    });
  });

  it('returns the selected product detail from the detail cache', () => {
    const selectedProduct = createProductDetail({
      id: 2,
      name: 'Selected Phone',
    });
    const details: Record<number, ProductDetail> = {
      1: createProductDetail({ id: 1, name: 'Other Phone' }),
      2: selectedProduct,
    };

    expect(selectSelectedProductDetail.projector(details, 2)).toEqual(
      selectedProduct,
    );
    expect(selectSelectedProductDetail.projector(details, null)).toBeNull();
    expect(selectSelectedProductDetail.projector(details, 999)).toBeNull();
  });

  it('adds stock availability to product cards', () => {
    const products: Product[] = [
      createProduct({ id: 1, stockQuantity: 5 }),
      createProduct({ id: 2, stockQuantity: 0 }),
    ];

    expect(selectProductListWithStockStatus.projector(products)).toEqual([
      { ...products[0], isInStock: true },
      { ...products[1], isInStock: false },
    ]);
  });

  it('falls back to the default price range when no range is selected', () => {
    expect(selectPriceRange.projector(null, null)).toEqual({
      min: 0,
      max: 100000,
    });
  });

  it('reads product add-on plans by product id', () => {
    const insurancePlans: Record<number, InsurancePlan[]> = {
      1: [
        {
          name: 'Screen protection',
          code: 'screen-protect',
          description: 'Accidental damage protection',
          amount: '499.00',
        },
      ],
    };
    const mobilePlans: Record<number, MobilePlan[]> = {
      1: [
        {
          name: 'Starter data plan',
          code: 'starter-data',
          amount: '999.00',
          dataAllowance: '10GB',
          description: 'A starter monthly data bundle',
        },
      ],
    };

    expect(selectInsurancePlansForProduct(1).projector(insurancePlans)).toEqual(
      insurancePlans[1],
    );
    expect(selectInsurancePlansForProduct(2).projector(insurancePlans)).toEqual(
      [],
    );
    expect(selectMobilePlansForProduct(1).projector(mobilePlans)).toEqual(
      mobilePlans[1],
    );
    expect(selectMobilePlansForProduct(2).projector(mobilePlans)).toEqual([]);
  });
});

function createProduct(overrides: Partial<Product>): Product {
  return {
    id: 1,
    name: 'Orange Phone',
    description: 'A flagship phone',
    price: 39999,
    stockQuantity: 8,
    imageUrl: '/assets/phone.png',
    categoryId: 1,
    ...overrides,
  };
}

function createProductDetail(overrides: Partial<ProductDetail>): ProductDetail {
  return createProduct(overrides);
}
