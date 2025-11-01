import { Component, inject } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthRequest } from '../../models/auth-request';
import { AuthResponse } from '../../models/auth-response';
import { SecurityApi } from '../../services/security-api';
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private _securityApi=inject(SecurityApi);
  private _activatedRoute=inject(ActivatedRoute);
  private _router=inject(Router);
  protected user: AuthRequest = new AuthRequest();
  protected authResponse:AuthResponse;
  protected authErrorMessage:string;
  private _returnurl:string;

  ngOnInit():void{
    this._returnurl=this._activatedRoute.snapshot.queryParams['returnurl'];
  }

  protected onCredentialsSubmit():void{
    this._securityApi.authenticateCredentials(this.user).subscribe({
      next: response=>{
       if(response.token){
        if(this._returnurl){
          this._router.navigate([this._returnurl]);
        }else{
          this._router.navigate(['/home']);
        }
      }else{
        this.authErrorMessage=response.message;
        setTimeout(() => {
          this.authErrorMessage="";
        }, 5000);
      }
      }
    });
  }

}
