import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthRequest } from '../models/auth-request';
import { AuthResponse } from '../models/auth-response';
import { HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecurityApi {
  private _baseUrl:string='http://192.168.1.11:9090/api';
  private _httpClient = inject(HttpClient);
  public authenticateCredentials(user:AuthRequest):Observable<AuthResponse>{
    return this._httpClient.post<AuthResponse>(`${this._baseUrl}/users/authenticate`,user,{
      headers:{
        'Content-Type':'application/json'
      }
    }).pipe(
      tap({
        next: response => {
          if(response.token){
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('role', response.role);
          localStorage.setItem('email', response.email);
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
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    const email = localStorage.getItem('email');

    if (!refreshToken || !email) {
      console.warn('No refresh token or email available. Logging out.');
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this._httpClient.post<AuthResponse>(
      `${this._baseUrl}/users/refresh`,
      { email, refreshToken },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).pipe(
      tap(response => {
        // Update both tokens if available
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }

        // Optional: log for debugging (remove in production)
        console.log('Token refreshed successfully:', response);
      }),
      // catchError(err => {
      //   console.error('Refresh token failed:', err);
      //   this.logout();
      //   return throwError(() => err);
      // })
    );
  }

  logout() : void{
    localStorage.clear();
  }
}
