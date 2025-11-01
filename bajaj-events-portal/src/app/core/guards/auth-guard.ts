import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  let token = localStorage.getItem('token');

  let _router = inject(Router);
    if(token===null){
      _router.navigate(['/login'],{
        queryParams:{
          'returnurl':state.url
        }
      });
  return false;
}
  return true;
};