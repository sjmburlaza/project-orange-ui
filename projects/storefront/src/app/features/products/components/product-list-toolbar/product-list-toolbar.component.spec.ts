import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListToolbarComponent } from './product-list-toolbar.component';

describe('ProductListToolbarComponent', () => {
  let component: ProductListToolbarComponent;
  let fixture: ComponentFixture<ProductListToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListToolbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
