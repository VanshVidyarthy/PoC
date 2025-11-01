import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthRequest } from '../../models/auth-request';
import { AuthResponse } from '../../models/auth-response';
import { SecurityApi } from '../../services/security-api';

@Component({
  selector: 'bajaj-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true
})
export class Login implements OnInit {
  private _securityApi = inject(SecurityApi);
  protected user: AuthRequest = new AuthRequest();
  protected authResponse: AuthResponse | null = null;
  protected authErrorMessage: string = '';
  protected isLoading: boolean = false;

  ngOnInit(): void {
    console.log('[Login] ngOnInit');
    // If token already exists (page refresh), try to hydrate user
    this._securityApi.ensureUserCached();
  }

  protected onCredentialsSubmit(): void {
    if (!this.user.email || !this.user.password) {
      this.authErrorMessage = 'Please enter both email and password.';
      setTimeout(() => {
        this.authErrorMessage = '';
      }, 5000);
      return;
    }

    this.isLoading = true;
    this.authErrorMessage = '';

    this._securityApi.authenticateCredentials(this.user).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.token) {
          // Authentication successful
          this.authResponse = response;
          this.authErrorMessage = '';
          // You can emit an event here to notify parent component
          console.log('Login successful!', response);
          // Attempt to ensure user data present if backend omitted fields
          this._securityApi.ensureUserCached();
          
          // Clear the form
          this.user = new AuthRequest();
        } else {
          this.authErrorMessage = response.message || 'Login failed. Please try again.';
          setTimeout(() => {
            this.authErrorMessage = '';
          }, 5000);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login error:', err);
        this.authErrorMessage = 'Login failed. Please check your credentials and try again.';
        setTimeout(() => {
          this.authErrorMessage = '';
        }, 5000);
      }
    });
  }

  // Check if user is currently logged in
  protected isLoggedIn(): boolean {
    return !!this._securityApi.getToken();
  }

  // Get current user info
  protected getCurrentUser() {
    return {
      name: this._securityApi.getUserName(),
      email: this._securityApi.getUserEmail(),
      role: this._securityApi.getUserRole()
    };
  }

  // Logout functionality
  protected logout(): void {
    this._securityApi.logout();
    this.authResponse = null;
    this.user = new AuthRequest();
    console.log('User logged out');
  }
}
