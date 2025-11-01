import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SecurityApi } from '../../../features/security/services/security-api';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private _router = inject(Router);
  private _securityApi = inject(SecurityApi);
  protected isLoggedIn: boolean = false;
  protected role:string|null;

  ngOnInit(): void {
    this._router.events.subscribe({
      next: event => {
        if (this._securityApi.getToken()) {
          this.role = this._securityApi.getUserRole();
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      }
    });
  }

  logout(): void {
    this.isLoggedIn = false;
    this._securityApi.logout();
  }

}
