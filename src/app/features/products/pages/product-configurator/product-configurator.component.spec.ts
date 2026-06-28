import { ComponentFixture, TestBed } from '@angular/core/testing';
import providers from 'src/test-providers';

import { ProductConfiguratorComponent } from './product-configurator.component';

describe('ProductConfiguratorComponent', () => {
  let component: ProductConfiguratorComponent;
  let fixture: ComponentFixture<ProductConfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductConfiguratorComponent],
      providers,
    }).compileComponents();

    fixture = TestBed.createComponent(ProductConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
