import { Component, OnInit, inject, computed, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductDetails } from '../../../products/components/product-details/product-details';
import { CartService } from '../../../carts/services/cart.service';
import { SearchService } from '../../../../shared/services/search.service';

// Category interface
interface Category {
  _id: string;
  name: string;
  slug: string;
  parentId: string | null;
  image: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Categories API Response interface
interface CategoriesApiResponse {
  categories: Category[];
}

// Product interface
interface Product {
  _id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  discount: number;
  categoryId: string | { _id: string; name: string };
  brand: string;
  images: string[];
  stock: number;
  rating: number;
  numReviews: number;
  attributes: {
    color: string;
    material: string;
    warranty: string;
  };
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Products API Response interface
interface ProductsApiResponse {
  success: boolean;
  total: number;
  page: number;
  pages: number;
  count: number;
  data: Product[];
}

// Categories API Service
class CategoriesApi {
  private _baseUrl: string = 'http://localhost:9090/api/';
  private _httpClient = inject(HttpClient);

  public getAllCategories(): Observable<CategoriesApiResponse> {
    return this._httpClient.get<CategoriesApiResponse>(`${this._baseUrl}categories`);
  }

  public getProductsByCategory(categoryId: string, page: number = 1, limit: number = 12): Observable<ProductsApiResponse> {
    return this._httpClient.get<ProductsApiResponse>(`${this._baseUrl}products?category=${categoryId}&page=${page}&limit=${limit}`);
  }
}

@Component({
  selector: 'bajaj-category-details',
  imports: [CommonModule, ProductDetails],
  templateUrl: './category-details.html',
  styleUrl: './category-details.css',
})
export class CategoryDetails implements OnInit, OnChanges {
  private categoriesApi = new CategoriesApi();
  public cartService = inject(CartService);
  private searchService = inject(SearchService);

  // Categories state
  categories: Category[] = [];
  categoriesLoading = true;
  categoriesError: string | null = null;

  // Products state
  selectedCategory: Category | null = null;
  currentProducts: Product[] = [];
  productsLoading = false;
  productsError: string | null = null;
  
  filteredProducts = computed(() => {
    const q = this.searchService.normalized();
    if (!q) return this.currentProducts;
    return this.currentProducts.filter(p => [p.name, p.description, p.brand]
      .filter(Boolean)
      .some(val => val.toLowerCase().includes(q)));
  });

  // Pagination state
  currentPage = 1;
  totalPages = 1;
  productsPerPage = 12;
  totalProductsCount = 0;

  // Modal state for product details
  selectedProductId: string | null = null;
  isModalVisible = false;

  // Reset trigger coming from parent (App) to force returning to categories root
  @Input() resetTrigger: number | null = null;

  ngOnInit() {
    this.loadCategories();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resetTrigger'] && !changes['resetTrigger'].firstChange) {
      console.log('[CategoryDetails] resetTrigger changed ->', changes['resetTrigger'].currentValue);
      this.backToCategories();
    }
  }

  // Load all categories
  loadCategories() {
    this.categoriesLoading = true;
    this.categoriesError = null;

    console.log('Loading categories from API...');

    this.categoriesApi.getAllCategories().subscribe({
      next: (response) => {
        console.log('Categories API Response:', response);
        if (response && Array.isArray(response.categories)) {
          this.categories = response.categories;
          this.categoriesLoading = false;
          console.log(`Categories loaded successfully: ${this.categories.length} categories`);
        } else {
          console.warn('Invalid categories API response structure:', response);
          this.categoriesError = 'Invalid categories data received.';
          this.categoriesLoading = false;
        }
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.categoriesError = 'Failed to load categories. Please try again later.';
        this.categoriesLoading = false;
      }
    });
  }

  // Load products for selected category
  loadProductsByCategory(category: Category) {
    this.selectedCategory = category;
    this.currentPage = 1; // Reset to first page
    this.productsLoading = true;
    this.productsError = null;

    console.log(`Loading products for category: ${category.name} (${category._id})`);

    this.categoriesApi.getProductsByCategory(category._id, this.currentPage, this.productsPerPage).subscribe({
      next: (response) => {
        console.log('Products API Response:', response);
        if (response && response.success && Array.isArray(response.data)) {
          this.currentProducts = response.data;
          this.totalProductsCount = response.total;
          this.totalPages = response.pages;
          this.productsLoading = false;
          console.log(`Products loaded for ${category.name}: ${this.currentProducts.length} products`);
        } else {
          console.warn('Invalid products API response structure:', response);
          this.productsError = 'Invalid products data received.';
          this.productsLoading = false;
        }
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.productsError = `Failed to load products for ${category.name}. Please try again later.`;
        this.productsLoading = false;
      }
    });
  }

  // Change page for products pagination
  changePage(page: number | string) {
    if (!this.selectedCategory) {
      console.warn('No category selected for pagination');
      return;
    }

    let newPage = this.currentPage;

    if (page === 'prev' && this.currentPage > 1) {
      newPage = this.currentPage - 1;
    } else if (page === 'next' && this.currentPage < this.totalPages) {
      newPage = this.currentPage + 1;
    } else if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      newPage = page;
    }

    if (newPage !== this.currentPage) {
      this.currentPage = newPage;
      console.log(`Changing to page ${newPage} for category ${this.selectedCategory.name}`);
      this.loadProductsForCurrentPage();
    }
  }

  // Load products for current page (separate method for cleaner code)
  private loadProductsForCurrentPage() {
    if (!this.selectedCategory) return;

    this.productsLoading = true;
    this.productsError = null;

    console.log(`Loading page ${this.currentPage} for category: ${this.selectedCategory.name}`);

    this.categoriesApi.getProductsByCategory(this.selectedCategory._id, this.currentPage, this.productsPerPage).subscribe({
      next: (response) => {
        console.log(`Products for page ${this.currentPage}:`, response);
        if (response && response.success && Array.isArray(response.data)) {
          this.currentProducts = response.data;
          this.totalProductsCount = response.total;
          this.totalPages = response.pages;
          this.productsLoading = false;
          console.log(`✅ Page ${this.currentPage} loaded: ${this.currentProducts.length} products`);
        } else {
          console.warn('❌ Invalid products API response structure:', response);
          this.productsError = 'Invalid products data received.';
          this.productsLoading = false;
        }
      },
      error: (err) => {
        console.error('❌ Error loading products for page:', err);
        this.productsError = `Failed to load products for ${this.selectedCategory?.name || 'selected category'}. Please try again later.`;
        this.productsLoading = false;
      }
    });
  }

  // Calculate discounted price
  getDiscountedPrice(product: Product): number {
    return product.price * (1 - product.discount / 100);
  }

  // Get stars array for rating display
  getStarsArray(rating: number): { type: 'full' | 'half' | 'empty' }[] {
    const stars: { type: 'full' | 'half' | 'empty' }[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push({ type: 'full' });
    }

    // Add half star if needed
    if (hasHalfStar && fullStars < 5) {
      stars.push({ type: 'half' });
    }

    // Add empty stars to complete 5 stars
    const totalStarsAdded = fullStars + (hasHalfStar && fullStars < 5 ? 1 : 0);
    for (let i = totalStarsAdded; i < 5; i++) {
      stars.push({ type: 'empty' });
    }

    return stars;
  }

  // Back to categories list
  backToCategories() {
    this.selectedCategory = null;
    this.currentProducts = [];
    this.currentPage = 1;
  }

  // Pagination getters
  get isPrevDisabled(): boolean {
    return this.currentPage === 1;
  }

  get isNextDisabled(): boolean {
    return this.currentPage === this.totalPages;
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  isPageActive(page: number): boolean {
    return this.currentPage === page;
  }

  get endProductIndex(): number {
    return Math.min(this.currentPage * this.productsPerPage, this.totalProductsCount);
  }

  // Modal methods
  openProductDetails(productId: string) {
    console.log('Opening product details modal for product ID:', productId);
    this.selectedProductId = productId;
    this.isModalVisible = true;
  }

  closeProductDetails() {
    this.selectedProductId = null;
    this.isModalVisible = false;
  }

  // Add product to cart
  addToCart(product: Product) {
    this.cartService.addProduct(product, 1);
    console.log('Added to cart from category view:', product.name);
  }

  checkout() {
    window.location.href = 'https://paytm.com/';
  }
}
