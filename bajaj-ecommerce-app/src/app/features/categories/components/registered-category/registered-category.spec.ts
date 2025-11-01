import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredCategory } from './registered-category';

describe('RegisteredCategory', () => {
  let component: RegisteredCategory;
  let fixture: ComponentFixture<RegisteredCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisteredCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisteredCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
