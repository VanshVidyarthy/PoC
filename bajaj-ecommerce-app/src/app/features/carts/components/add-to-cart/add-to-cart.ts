import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import { getDiscountedPrice } from '../../../products/models/product';

@Component({
  selector: 'bajaj-add-to-cart',
  imports: [CommonModule],
  templateUrl: './add-to-cart.html',
  styleUrl: './add-to-cart.css',
})
export class AddToCart {
  private cartService = inject(CartService);

  // Signals derived from service
  items = computed(() => this.cartService.items());
  totalCount = computed(() => this.cartService.totalCount());
  totalValue = computed(() => this.cartService.totalValue());

  // Helpers
  getDiscountedPrice = getDiscountedPrice;

  trackByProductId(index: number, item: CartItem) {
    return item.product._id;
  }

  remove(productId: string) {
    this.cartService.removeProduct(productId);
  }

  updateQuantity(productId: string, event: Event) {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value, 10);
    if (!isNaN(value)) {
      this.cartService.updateQuantity(productId, value);
    }
  }

  clear() {
    this.cartService.clearCart();
  }

  checkout() {
    // Redirect to common Paytm link (placeholder)
    window.location.href = 'https://paytm.com/';
  }
}
