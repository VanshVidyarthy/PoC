import { Component, inject, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeApi } from '../../services/employee-api';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-employee',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register-employee.html',
  styleUrl: './register-employee.css',
})
export class RegisterEmployee implements OnDestroy {
  private _employeeApi = inject(EmployeeApi);
  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder);
  private _employeeApiSubscription: Subscription;
  
  protected title: string = 'Register New Employee!';
  protected employeeForm: FormGroup;

  constructor() {
    this.employeeForm = this._formBuilder.group({
      employeeId: [0, [Validators.required, Validators.min(1)]],
      employeeName: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zipcode: ['', [Validators.required, Validators.pattern(/^\d{5,6}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      skillSets: ['', Validators.required],
      country: ['', Validators.required],
      avatar: [''],
      joiningDate: ['', Validators.required]
    });
  }

  protected onEmployeeSubmit(): void {
    if (this.employeeForm.valid) {
      this._employeeApiSubscription = this._employeeApi.registerNewEmployee(this.employeeForm.value).subscribe({
        next: (data: any) => {
          if (data.acknowledged === true) {
            this._router.navigate(['/employees']);
          }
        },
        error: (err: any) => {
          console.error('Error registering employee:', err);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.employeeForm.controls).forEach(field => {
      const control = this.employeeForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  ngOnDestroy(): void {
    if (this._employeeApiSubscription) {
      this._employeeApiSubscription.unsubscribe();
    }
  }
}
