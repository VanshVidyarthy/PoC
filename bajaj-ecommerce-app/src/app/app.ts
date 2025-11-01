import { Component, signal, inject } from '@angular/core';
import { Slider } from './shared/components/slider/slider';
import { SideNavBar } from './shared/components/side-nav-bar/side-nav-bar';
import { Banner } from './shared/components/banner/banner';
import { Footer } from './shared/components/footer/footer';
import { CategoryDetails } from './features/categories/components/category-details/category-details';
import { AddToCart } from './features/carts/components/add-to-cart/add-to-cart';
import { Login } from './features/security/components/login/login';
import { RegisterUser } from './features/users/components/register-user/register-user';
import { ProductsList } from './features/products/components/products-list/products-list';
import { SearchService } from './shared/services/search.service';

@Component({
  selector: 'bajaj-root',
  imports: [Slider, SideNavBar, Banner, Footer, CategoryDetails, Login, RegisterUser, AddToCart],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('bajaj-ecommerce-app');
  private searchService = inject(SearchService);
  
  // Navigation state
  currentView = signal('home'); // 'home', 'categories', etc.

  // Simple login state derived from localStorage token
  isLoggedIn = signal(!!localStorage.getItem('token'));

  // Trigger counter to allow forcing CategoryDetails to reset back to categories list
  categoriesResetTrigger = signal(0);

  // Refresh login state when navigating (in case login/logout happened elsewhere)
  private refreshAuthState() {
    this.isLoggedIn.set(!!localStorage.getItem('token'));
  }
  
  // Handle navigation events from sidebar
  onNavigate(page: string) {
    console.log(`App received navigation event: ${page}`);
    // Prevent navigation to signup if already logged in
    if (page === 'signup' && this.isLoggedIn()) {
      console.log('Already logged in; redirecting signup request to home');
      page = 'home';
    }

     // If user clicks categories while already on categories, force a reset
     if (page === 'categories' && this.currentView() === 'categories') {
       const next = this.categoriesResetTrigger() + 1;
       console.log('[App] Forcing categories reset trigger ->', next);
       this.categoriesResetTrigger.set(next);
     }
    this.currentView.set(page);
    this.refreshAuthState();
  }

  // Search handlers (used in template header search bar)
  onSearchInput(value: string) {
    this.searchService.setQuery(value);
  }

  clearSearch() {
    this.searchService.clear();
  }

  currentSearchQuery() {
    return this.searchService.query();
  }
}
