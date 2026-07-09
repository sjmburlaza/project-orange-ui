import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackToTopComponent } from './back-to-top.component';

describe('BackToTopComponent', () => {
  let component: BackToTopComponent;
  let fixture: ComponentFixture<BackToTopComponent>;
  let scrollY = 0;

  beforeEach(async () => {
    vi.spyOn(window, 'scrollY', 'get').mockImplementation(() => scrollY);

    await TestBed.configureTestingModule({
      imports: [BackToTopComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BackToTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows as soon as the user scrolls down', () => {
    expect(fixture.nativeElement.querySelector('button')).toBeNull();

    scrollY = 1;
    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button')).not.toBeNull();
  });

  it('hides again when the user returns to the top', () => {
    scrollY = 1;
    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).not.toBeNull();

    scrollY = 0;
    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });

  it('uses a custom threshold and accessible label', () => {
    fixture.componentRef.setInput('showAfter', 100);
    fixture.componentRef.setInput('ariaLabel', 'Return to page start');
    scrollY = 101;

    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Return to page start');
  });

  it('smoothly scrolls to the top when clicked', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    scrollY = 1;
    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();

    expect(scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });
});
