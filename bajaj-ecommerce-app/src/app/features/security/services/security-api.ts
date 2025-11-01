import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthRequest } from '../models/auth-request';
import { AuthResponse } from '../models/auth-response';

@Injectable({
  providedIn: 'root'
})
export class SecurityApi {
  private _baseUrl:string='http://localhost:9090/api';
  private _httpClient = inject(HttpClient);
  // Generic deep value extractor for flexible backend payloads
  private _deepFind(obj: any, keys: string[]): any {
    if (!obj || typeof obj !== 'object') return null;
    const queue: any[] = [obj];
    while (queue.length) {
      const current = queue.shift();
      if (!current) continue;
      for (const k of keys) {
        if (Object.prototype.hasOwnProperty.call(current, k)) {
          const val = current[k];
          if (val !== undefined && val !== null) return val;
        }
      }
      for (const value of Object.values(current)) {
        if (value && typeof value === 'object') queue.push(value);
      }
    }
    return null;
  }

  public authenticateCredentials(user:AuthRequest):Observable<AuthResponse>{
    return this._httpClient.post<AuthResponse>(`${this._baseUrl}/auth/login`,user,{
      headers:{
        'Content-Type':'application/json'
      }
    }).pipe(
      tap({
        next: (response) => {
          if(response.token){
            localStorage.setItem('token', response.token);
            localStorage.setItem('refreshToken', response.refreshToken);
            
            // Try multiple possible role keys (cast to any for flexibility)
            const role = response.role 
              || (response as any).userRole 
              || (response as any).authority 
              || (response as any).authorities?.[0]
              || this._deepFind(response, ['role','userRole','authority','authorities']);
            if (role) {
              localStorage.setItem('role', role);
            } else {
              console.warn('No role found in response:', response); // Debug log
            }
            
            // Try multiple possible email keys
            const email = response.email 
              || (response as any).userEmail 
              || (response as any).emailAddress
              || this._deepFind(response, ['email','userEmail','emailAddress','sub']);
            if (email) localStorage.setItem('email', email);
            
            const name = response.name 
              || (response as any).fullName 
              || (response as any).username 
              || this._deepFind(response, ['name','fullName','username']);
            if (name) localStorage.setItem('name', name);
          }
        }
      })
    );
  }
  getToken():string | null{
    return localStorage.getItem('token');
  }
  getRefreshToken():string | null{
    return localStorage.getItem('refreshToken');
  }
  getUserRole():string | null{
    return localStorage.getItem('role');
  }
  getUserEmail():string | null{
    return localStorage.getItem('email');
  }
  getUserName():string | null{
    return localStorage.getItem('name');
  }
  getUserPhone():string | null{
    return localStorage.getItem('phone');
  }

  // Attempt to decode JWT and persist any missing fields
  private _decodeJwt(token: string): any | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = atob(parts[1].replace(/-/g,'+').replace(/_/g,'/'));
      return JSON.parse(payload);
    } catch (e) {
      console.warn('[SecurityApi] JWT decode failed', e);
      return null;
    }
  }

  ensureUserCached(): void {
    const token = this.getToken();
    if (!token) {
      console.log('[SecurityApi.ensureUserCached] No token present, skipping');
      return;
    }
    const existingEmail = this.getUserEmail();
    const existingRole = this.getUserRole();
    if (existingEmail && existingRole) {
      console.log('[SecurityApi.ensureUserCached] Email & role already cached');
      return;
    }
    console.log('[SecurityApi.ensureUserCached] Attempting to decode token for missing fields');
    const payload = this._decodeJwt(token);
    if (!payload) return;
    const email = payload.email || payload.userEmail || payload.sub;
    const role = payload.role || payload.userRole || (Array.isArray(payload.authorities)? payload.authorities[0] : undefined);
    const name = payload.name || payload.fullName || payload.username;
    if (email && !existingEmail) {
      localStorage.setItem('email', email);
      console.log('[SecurityApi.ensureUserCached] Stored email from token payload:', email);
    }
    if (role && !existingRole) {
      localStorage.setItem('role', role);
      console.log('[SecurityApi.ensureUserCached] Stored role from token payload:', role);
    }
    if (name && !this.getUserName()) {
      localStorage.setItem('name', name);
      console.log('[SecurityApi.ensureUserCached] Stored name from token payload:', name);
    }
  }

  logout() : void{
    localStorage.clear();
  }

  // User registration (signup)
  // Accepts a generic payload with name, email, password, role etc.
  // Returns a Promise for simpler consumption in existing RegisterUser component.
  register(user: any): Promise<any> {
    return this._httpClient.post<any>(`${this._baseUrl}/auth/register`, user, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      tap({
        next: response => {
          // Optionally auto-login: store token if backend returns one
          if (response?.token) {
            localStorage.setItem('token', response.token);
            if (response.refreshToken) localStorage.setItem('refreshToken', response.refreshToken);
            if (response.role) localStorage.setItem('role', response.role);
            if (response.email) localStorage.setItem('email', response.email);
            if (response.name) localStorage.setItem('name', response.name);
            if (response.phone) localStorage.setItem('phone', response.phone);
          }
        }
      })
    ).toPromise();
  }

  // Fetch logged-in user's profile from /api/auth/me and persist keys
  fetchCurrentUser(): Promise<any> {
    const token = this.getToken();
    if (!token) return Promise.resolve(null);
    return this._httpClient.get<any>(`${this._baseUrl}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      tap({
        next: profile => {
          console.log('Profile response from /auth/me:', profile); // Debug log
          if (!profile) return;
            const email = profile.email 
              || (profile as any).userEmail 
              || (profile as any).emailAddress 
              || this._deepFind(profile, ['email','userEmail','emailAddress','sub']);
            if (email) localStorage.setItem('email', email);
          
          // Try multiple role keys from profile
            const role = profile.role 
              || (profile as any).userRole 
              || (profile as any).authority 
              || (profile as any).authorities?.[0]
              || this._deepFind(profile, ['role','userRole','authority','authorities']);
          if (role) {
            localStorage.setItem('role', role);
          }
          
            const name = profile.name 
              || (profile as any).fullName 
              || (profile as any).username 
              || this._deepFind(profile, ['name','fullName','username']);
            if (name) localStorage.setItem('name', name);
          if (profile.phone) localStorage.setItem('phone', profile.phone);
          // After profile, ensure missing fields via token decode
          this.ensureUserCached();
        }
      })
    ).toPromise();
  }
}
