import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityApi } from '../../../features/security/services/security-api';
import { CartService } from '../../../features/carts/services/cart.service';

declare var bootstrap: any;

@Component({
  selector: 'bajaj-side-nav-bar',
  imports: [CommonModule],
  templateUrl: './side-nav-bar.html',
  styleUrl: './side-nav-bar.css',
})
export class SideNavBar implements OnInit, AfterViewInit {
  @Output() navigate = new EventEmitter<string>();
  @Input() currentView: string = 'home';
  
  private _securityApi = inject(SecurityApi);
  private _cartService = inject(CartService);

  cartCount = computed(() => this._cartService.totalCount());

  // Use a method instead of computed so it reflects latest localStorage token state
  isLoggedIn() : boolean {
    return !!this._securityApi.getToken();
  }

  isAdmin(): boolean {
    const role = this._securityApi.getUserRole();
    if (!role) return false;
    const isAdminRole = role.toLowerCase() === 'admin' || role.toLowerCase() === 'administrator';
    console.log('Is admin?', isAdminRole); // Debug log
    return isAdminRole;
  }

  get userSummary() {
    if (!this.isLoggedIn()) return null;
    const summary = {
      name: this._securityApi.getUserName(),
      email: this._securityApi.getUserEmail(),
      phone: this._securityApi.getUserPhone(),
      role: this._securityApi.getUserRole()
    };
    console.log('[SideNavBar] userSummary:', summary);
    return summary;
  }

  ngOnInit() {
    console.log('[SideNavBar] ngOnInit - ensuring cached user');
    this._securityApi.ensureUserCached();
  }

  ngAfterViewInit() {
    // Ensure Bootstrap is loaded and initialize offcanvas
    if (typeof bootstrap !== 'undefined') {
      const offcanvasElement = document.getElementById('sideNavbar');
      if (offcanvasElement) {
        // Initialize Bootstrap offcanvas with backdrop functionality
        const offcanvas = new bootstrap.Offcanvas(offcanvasElement, {
          backdrop: true,
          keyboard: true
        });
        
        // Add event listeners for debugging
        offcanvasElement.addEventListener('show.bs.offcanvas', () => {
          console.log('Offcanvas is opening');
        });
        
        offcanvasElement.addEventListener('hide.bs.offcanvas', () => {
          console.log('Offcanvas is closing');
        });
      }
    } else {
      console.warn('Bootstrap is not loaded');
    }
  }
  
  // Handle navigation clicks
  onNavigate(page: string, event: Event) {
    event.preventDefault();
    console.log(`Navigating to: ${page}`);
    this.navigate.emit(page);
    
    // Close offcanvas on mobile after navigation
    const offcanvasElement = document.getElementById('sideNavbar');
    if (offcanvasElement && typeof bootstrap !== 'undefined') {
      const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
      if (offcanvas) {
        offcanvas.hide();
      }
    }
  }

  // Explicit logout from the side nav so auth state resets immediately
  logout(event: Event) {
    event.preventDefault();
    console.log('Executing logout from side nav');
    this._securityApi.logout();
    // Emit navigation to login view after clearing tokens
    this.navigate.emit('login');
    this.currentView = 'login';

    // Close offcanvas if open (mobile)
    const offcanvasElement = document.getElementById('sideNavbar');
    if (offcanvasElement && typeof bootstrap !== 'undefined') {
      const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
      if (offcanvas) {
        offcanvas.hide();
      }
    }
  }
}
