import { Component, OnInit, inject, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartService } from '../../../carts/services/cart.service';

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

// API Response interface for individual product
interface ProductApiResponse {
  success: boolean;
  data: Product;
}

// Products API Service
class ProductDetailsApi {
  private _baseUrl: string = 'http://localhost:9090/api/';
  private _httpClient = inject(HttpClient);    
  
  public getProductDetails(productId: string): Observable<ProductApiResponse> {
    return this._httpClient.get<ProductApiResponse>(`${this._baseUrl}products/${productId}`);
  }
}

@Component({
  selector: 'bajaj-product-details',
  imports: [CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit, OnChanges {
  private productDetailsApi = new ProductDetailsApi();
  public cartService = inject(CartService);
  
  @Input() productId: string | null = null;
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  
  product: Product | null = null;
  loading = true;
  error: string | null = null;
  currentImageIndex = 0;
  
  ngOnInit() {
    // Only load if productId is provided and modal is visible
    if (this.productId && this.isVisible) {
      this.loadProductDetails();
    }
  }
  
  ngOnChanges() {
    console.log('ProductDetails ngOnChanges called:', {
      productId: this.productId,
      isVisible: this.isVisible,
      hasProduct: !!this.product
    });
    
    // Load product details when productId or visibility changes
    if (this.productId && this.isVisible) {
      console.log('Triggering loadProductDetails from ngOnChanges');
      this.loadProductDetails();
    }
  }
  
  loadProductDetails() {
    if (!this.productId) {
      console.warn('No productId provided');
      return;
    }
    
    this.loading = true;
    this.error = null;
    this.currentImageIndex = 0;
    this.product = null; // Reset product to null
    
    console.log(`🔍 Loading product details for ID: ${this.productId}`);
    
    this.productDetailsApi.getProductDetails(this.productId).subscribe({
      next: (response) => {
        console.log('Raw API response:', response);
        // Extract product from the API response data property
        if (response && response.success && response.data) {
          this.product = response.data;
          this.loading = false;
          console.log('Product details loaded successfully:', this.product);
          console.log('Product images:', this.product?.images);
        } else {
          console.warn('Invalid API response structure:', response);
          this.error = 'Invalid product data received from server.';
          this.loading = false;
          this.product = null;
        }
      },
      error: (err) => {
        console.error('Error loading product details:', err);
        console.error('Error details:', {
          status: err.status,
          message: err.message,
          url: err.url
        });
        this.error = 'Failed to load product details. Please try again later.';
        this.loading = false;
        this.product = null;
      }
    });
  }
  
  // Get discounted price
  getDiscountedPrice(product: Product): number {
    return product.price * (1 - product.discount / 100);
  }
  
  // Safe getter for product with default values
  get safeProduct() {
    return this.product || {
      _id: '',
      name: 'Loading...',
      sku: '',
      description: 'Loading product details...',
      price: 0,
      discount: 0,
      categoryId: '',
      brand: 'Loading...',
      images: ['/images/camera.png'],
      stock: 0,
      rating: 0,
      numReviews: 0,
      attributes: {
        color: 'N/A',
        material: 'N/A',
        warranty: 'N/A'
      },
      isFeatured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0
    };
  }
  
  // Safe getter for product images
  get safeImages(): string[] {
    return (this.product?.images && this.product.images.length > 0) 
      ? this.product.images 
      : ['/images/camera.png'];
  }
  
  // Get savings amount
  getSavings(product: Product): number {
    return product.price - this.getDiscountedPrice(product);
  }
  
  // Get star rating display with proper half-star handling
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
  
  // Format date for display
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  // Change current image
  changeImage(index: number) {
    const images = this.safeImages;
    if (index >= 0 && index < images.length) {
      this.currentImageIndex = index;
    }
  }
  
  // Close modal
  onCloseModal() {
    this.closeModal.emit();
  }
  
  // Handle backdrop click
  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onCloseModal();
    }
  }
  
  // Prevent modal content click from closing modal
  onModalContentClick(event: Event) {
    event.stopPropagation();
  }

  addToCart() {
    if (this.product) {
      this.cartService.addProduct(this.product, 1);
      console.log('Added to cart from modal:', this.product.name);
    }
  }

  checkout() {
    window.location.href = 'https://paytm.com/';
  }
}
