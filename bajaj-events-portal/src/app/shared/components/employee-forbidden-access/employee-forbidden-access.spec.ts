import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeForbiddenAccess } from './employee-forbidden-access';

describe('EmployeeForbiddenAccess', () => {
  let component: EmployeeForbiddenAccess;
  let fixture: ComponentFixture<EmployeeForbiddenAccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeForbiddenAccess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeForbiddenAccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
