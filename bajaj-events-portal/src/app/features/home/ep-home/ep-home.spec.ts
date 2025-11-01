import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpHome } from './ep-home';

describe('EpHome', () => {
  let component: EpHome;
  let fixture: ComponentFixture<EpHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
