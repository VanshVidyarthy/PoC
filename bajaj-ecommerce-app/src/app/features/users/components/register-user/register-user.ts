import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityApi } from '../../../security/services/security-api';
import { CartService } from '../../../carts/services/cart.service';
import { ToastService } from '../../../../shared/services/toast.service';
 
interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: string;
}
 
@Component({
  selector: 'bajaj-register-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-user.html',
  styleUrls: ['./register-user.css']
})
export class RegisterUser {
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _securityApi = inject(SecurityApi);
  private _cart = inject(CartService);
  private _toast = inject(ToastService);
 
  protected form: FormGroup = this._fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.strongPasswordValidator]],
      confirmPassword: ['', [Validators.required]],
      role: ['customer', [Validators.required]],
      phone: ['', []],
      address: ['', []],
    },
    { validators: this.passwordsMatchValidator }
  );
 
  protected submitting = false;
  protected serverError = '';
 
  protected passwordsMatchValidator(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }
 
  protected strongPasswordValidator(control: any) {
    const value = String(control?.value || '');
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasDigit = /\d/.test(value);
    const hasSpecial = /[^A-Za-z0-9]/.test(value);
    return hasUpper && hasLower && hasDigit && hasSpecial ? null : { weak: true };
  }
 
  protected onSubmit(): void {
    if (this.form.invalid || this.submitting) return;
    const payload: RegisterRequest = this.form.value as RegisterRequest;
    this.submitting = true;
    this.serverError = '';
    this._securityApi.register(payload).then(response => {
      this.submitting = false;
      this._toast.show('Registration successful', 'success');
      // If backend returned token user is logged in; else redirect to login
      const hasToken = !!this._securityApi.getToken();
      if (!hasToken) {
        // redirect to login optionally with returnurl
        const hasCartItems = this._cart.items().length > 0;
        const returnurl = hasCartItems ? '/cart' : '/home';
        this._router.navigate(['/login'], { queryParams: { registered: 'true', returnurl } });
      } else {
        // Already logged in, clear sensitive fields
        this.form.reset({ role: 'customer' });
      }
    }).catch(err => {
      console.error('Registration error', err);
      this.serverError = err?.error?.message || 'Registration failed. Please try again.';
      this._toast.show(this.serverError, 'error');
      this.submitting = false;
    });
  }

  protected isLoggedIn(): boolean {
    return !!this._securityApi.getToken();
  }
}
 
 