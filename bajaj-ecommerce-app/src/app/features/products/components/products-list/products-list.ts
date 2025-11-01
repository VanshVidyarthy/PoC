import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductDetails } from '../product-details/product-details';
import { CartService } from '../../../carts/services/cart.service';
import { SearchService } from '../../../../shared/services/search.service';

// API Response interface
interface ApiResponse {
  success: boolean;
  total: number;
  page: number;
  pages: number;
  count: number;
  data: Product[];
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

// Products API Service
class ProductsApi {
  private _baseUrl: string = 'http://localhost:9090/api/';
  private _httpClient = inject(HttpClient);    
  
  public getAllProducts(page: number = 1, limit: number = 18): Observable<ApiResponse> {
    return this._httpClient.get<ApiResponse>(`${this._baseUrl}products?page=${page}&limit=${limit}`);
  }
  
  public getProductDetails(productId: string): Observable<Product> {
    return this._httpClient.get<Product>(`${this._baseUrl}products/${productId}`);
  }
}

@Component({
  selector: 'bajaj-products-list',
  imports: [CommonModule, ProductDetails],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsList implements OnInit {
  private productsApi = new ProductsApi();
  public cartService = inject(CartService);
  private searchService = inject(SearchService);
  
  currentPage = 1;
  totalPages = 1;
  productsPerPage = 18;
  totalProductsCount = 0;
  
  currentProducts: Product[] = []; // Current page products (raw)
  loading = true;
  error: string | null = null;
  
  // Filtered products based on global search query
  filteredProducts = computed(() => {
    const q = this.searchService.normalized();
    if (!q) return this.currentProducts;
    const result = this.currentProducts.filter(p =>
      [p.name, p.description, p.brand, this.getCategoryName(p.categoryId)]
        .filter(Boolean)
        .some(val => val.toLowerCase().includes(q))
    );
    return result;
  });
  
  // Modal state for product details
  selectedProductId: string | null = null;
  isModalVisible = false;
  
  ngOnInit() {
    this.loadProducts();
  }
  
  loadProducts() {
    this.loading = true;
    this.error = null;
    
    console.log(`Loading products from API... Page: ${this.currentPage}, Limit: ${this.productsPerPage}`);
    
    this.productsApi.getAllProducts(this.currentPage, this.productsPerPage).subscribe({
      next: (response) => {
        console.log('API Response received:', response);
        // Extract products from the API response data property
        if (response && response.success && Array.isArray(response.data)) {
          this.currentProducts = response.data;
          this.totalProductsCount = response.total;
          this.totalPages = response.pages;
          this.loading = false;
          console.log(`✅ Products loaded successfully: ${this.currentProducts.length} products on page ${this.currentPage}`);
          console.log(`📊 Total: ${this.totalProductsCount} products across ${this.totalPages} pages`);
          console.log('First product:', this.currentProducts[0]);
        } else {
          console.warn('❌ Invalid API response structure:', response);
          this.loadFallbackProducts();
        }
      },
      error: (err) => {
        console.error('❌ Error loading products:', err);
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
        // Fallback to hardcoded products for testing
        this.loadFallbackProducts();
      }
    });
  }
  
  // Fallback hardcoded products if API fails
  loadFallbackProducts() {
    const fallbackProducts = [
      {
        _id: '1',
        name: 'Professional DSLR Camera',
        sku: 'CAM-001',
        description: 'High-resolution camera with advanced features for professional photography.',
        price: 45999,
        discount: 18,
        categoryId: 'electronics',
        brand: 'Canon',
        images: ['/images/camera.png'],
        stock: 25,
        rating: 4.8,
        numReviews: 127,
        attributes: { color: 'Black', material: 'Metal', warranty: '24 Months' },
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0
      },
      {
        _id: '2',
        name: 'Handcrafted Wooden Vases',
        sku: 'HOME-002',
        description: 'Beautiful handcrafted wooden decorative vases for your home decor.',
        price: 2499,
        discount: 29,
        categoryId: 'home-decor',
        brand: 'Artisan Crafts',
        images: ['/images/handcrafted-wooden-decorative-vases_23-2151003006.jpg'],
        stock: 15,
        rating: 4.2,
        numReviews: 89,
        attributes: { color: 'Brown', material: 'Wood', warranty: '6 Months' },
        isFeatured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0
      },
      {
        _id: '3',
        name: 'Indoor Plant Collection',
        sku: 'PLANT-003',
        description: 'Premium indoor plants perfect for home and office spaces.',
        price: 899,
        discount: 31,
        categoryId: 'plants',
        brand: 'Green Paradise',
        images: ['/images/houseplant-poster-template-vector-set-indoor-gardening_53876-144158.jpg'],
        stock: 50,
        rating: 4.9,
        numReviews: 203,
        attributes: { color: 'Green', material: 'Natural', warranty: '30 Days' },
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0
      },
      {
        _id: '4',
        name: 'Abstract Wall Art Set',
        sku: 'ART-004',
        description: 'Modern abstract circle wall art set to beautify your living space.',
        price: 3299,
        discount: 34,
        categoryId: 'art',
        brand: 'Modern Designs',
        images: ['/images/abstract-circle-wall-art-set_610324-6475.jpg'],
        stock: 12,
        rating: 4.1,
        numReviews: 67,
        attributes: { color: 'Multi-color', material: 'Canvas', warranty: '12 Months' },
        isFeatured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0
      },
      {
        _id: '5',
        name: 'Modern Entryway Furniture',
        sku: 'FURN-005',
        description: 'Stylish modern furniture set perfect for your home entryway.',
        price: 15999,
        discount: 27,
        categoryId: 'furniture',
        brand: 'Elite Furniture',
        images: ['/images/view-modern-entryway-with-interior-designed-furniture_23-2150790992.jpg'],
        stock: 8,
        rating: 4.7,
        numReviews: 156,
        attributes: { color: 'White', material: 'Wood & Metal', warranty: '36 Months' },
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0
      },
      {
        _id: '6',
        name: 'Wireless Bluetooth Headphones',
        sku: 'AUDIO-006',
        description: 'Premium wireless headphones with noise cancellation technology.',
        price: 8999,
        discount: 31,
        categoryId: 'electronics',
        brand: 'SoundTech',
        images: ['/images/camera.png'],
        stock: 35,
        rating: 4.6,
        numReviews: 341,
        attributes: { color: 'Black', material: 'Plastic & Metal', warranty: '18 Months' },
        isFeatured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0
      }
    ];
    
    // Simulate server-side pagination for fallback
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    this.currentProducts = fallbackProducts.slice(startIndex, endIndex);
    this.totalProductsCount = fallbackProducts.length;
    this.totalPages = Math.ceil(fallbackProducts.length / this.productsPerPage);
    this.loading = false;
  }

  // Calculate discounted price
  getDiscountedPrice(product: Product): number {
    return product.price * (1 - product.discount / 100);
  }

  // Get star rating display
  getStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '★'.repeat(fullStars);
    
    if (hasHalfStar && fullStars < 5) {
      stars += '☆'; // Half star representation
    }
    
    const totalStarsShown = fullStars + (hasHalfStar && fullStars < 5 ? 1 : 0);
    const emptyStars = 5 - totalStarsShown;
    stars += '☆'.repeat(emptyStars);
    
    return stars;
  }
  
  // Get stars array for better display (similar to product-details)
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

  // Get category name from categoryId (handle both string and object)
  getCategoryName(categoryId: string | { _id: string; name: string }): string {
    if (typeof categoryId === 'string') {
      return categoryId;
    }
    return categoryId?.name || 'Unknown';
  }

  // Change page function
  changePage(page: number | string) {
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
      this.loadProducts(); // Reload products for the new page
    }
  }

  // Check if previous button should be disabled
  get isPrevDisabled(): boolean {
    return this.currentPage === 1;
  }

  // Check if next button should be disabled
  get isNextDisabled(): boolean {
    return this.currentPage === this.totalPages;
  }

  // Check if page is active
  isPageActive(page: number): boolean {
    return this.currentPage === page;
  }
  
  // Get page numbers for pagination
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  
  // Helper method for calculating end product index in pagination display
  get endProductIndex(): number {
    return Math.min(this.currentPage * this.productsPerPage, this.totalProductsCount);
  }
  
  // Open product details modal
  openProductDetails(productId: string) {
    console.log('Opening product details modal for product ID:', productId);
    this.selectedProductId = productId;
    this.isModalVisible = true;
    console.log('Modal state:', {
      selectedProductId: this.selectedProductId,
      isModalVisible: this.isModalVisible
    });
  }
  
  // Close product details modal
  closeProductDetails() {
    this.selectedProductId = null;
    this.isModalVisible = false;
    console.log('Closing product details modal');
  }

  // Add product to cart
  addToCart(product: Product) {
    this.cartService.addProduct(product, 1);
    console.log('Product added to cart:', product.name);
  }

  checkout() {
    window.location.href = 'https://paytm.com/';
  }
}
