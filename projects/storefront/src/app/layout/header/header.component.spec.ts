import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent]
    })
    .compileComponents();

    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      common: {
        navigation: {
          home: 'Home',
          shop: 'Shop',
        },
      },
    });
    translate.use('en');

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders Home and Shop before the search component', () => {
    const header = fixture.nativeElement.querySelector('.header') as HTMLElement;
    const navigationLinks = Array.from(
      header.querySelectorAll<HTMLAnchorElement>('.primary-nav a'),
    );
    const navigation = header.querySelector('.primary-nav');
    const search = header.querySelector('app-search');

    expect(navigationLinks.map((link) => link.textContent?.trim())).toEqual([
      'Home',
      'Shop',
    ]);
    expect(navigationLinks[0].getAttribute('href')).toBeTruthy();
    expect(navigationLinks[1].getAttribute('href')).toContain('/products');
    expect(
      (navigation?.compareDocumentPosition(search as Node) ?? 0) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
