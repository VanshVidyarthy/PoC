import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityApi } from '../../security/services/security-api';

@Component({
  selector: 'bajaj-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private _securityApi = inject(SecurityApi);

  user = {
    name: '',
    email: '',
    phone: '',
    role: ''
  };
  loading = false;
  error: string = '';

  ngOnInit(): void {
    console.log('[Profile] ngOnInit');
    this._securityApi.ensureUserCached();
    this.populateFromStorage();
    console.log('[Profile] initial from storage:', this.user);
    // Try to refresh from backend
    this.refreshProfile();
  }

  populateFromStorage() {
    this.user.name = this._securityApi.getUserName() || '';
    this.user.email = this._securityApi.getUserEmail() || '';
    this.user.phone = this._securityApi.getUserPhone() || '';
    this.user.role = this._securityApi.getUserRole() || '';
    console.log('[Profile] populateFromStorage:', this.user);
  }

  refreshProfile() {
    if (!this._securityApi.getToken()) return; // not logged in
    this.loading = true;
    this._securityApi.fetchCurrentUser()
      .then(profile => {
        this.loading = false;
        if (profile) {
          this.populateFromStorage();
          console.log('[Profile] refreshed profile:', this.user);
        }
      })
      .catch(err => {
        this.loading = false;
        this.error = 'Failed to load profile';
        setTimeout(() => this.error = '', 4000);
        console.warn('Profile load error', err);
      });
  }
}
