import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupFieldComponent } from './group-field.component';

describe('GroupFieldComponent', () => {
  let component: GroupFieldComponent;
  let fixture: ComponentFixture<GroupFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
