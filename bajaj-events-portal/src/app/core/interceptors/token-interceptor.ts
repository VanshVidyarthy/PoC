import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { SecurityApi } from '../../features/security/services/security-api';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const securityApi = inject(SecurityApi);
  const isAuthEndpoint = req.url.includes('/users');
  const token = localStorage.getItem('token');

  // Step 1️- Attach token to non-auth requests
  let modifiedReq = req;
  if (!isAuthEndpoint) {
    let headers = req.headers
      .set('Content-Type', 'application/json')
      .set('bajaj-authorization-token', token || '');
    modifiedReq = req.clone({ headers });
  }

  // Step 2️- Handle expired token automatically
  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isAuthEndpoint) {
        console.warn('Token expired. Refreshing...');
        return securityApi.refreshToken().pipe(
          switchMap(response => {
            const newToken = response.token;
            console.log('Token refreshed successfully:', JSON.stringify(response));

            // store new token for next calls
            localStorage.setItem('token', newToken);
            if (response.refreshToken)
              localStorage.setItem('refreshToken', response.refreshToken);

            // retry original request with new token
            const retryReq = req.clone({
              setHeaders: {
                'Content-Type': 'application/json',
                'bajaj-authorization-token': newToken
              }
            });
            return next(retryReq);
          }),
          catchError(refreshError => {
            console.error('Refresh failed, logging out.');
            securityApi.logout();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
