import { Injectable, signal, computed } from '@angular/core';
import { Product, getDiscountedPrice } from '../../products/models/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<CartItem[]>([]);

  // Expose items as readonly signal
  readonly items = computed(() => this._items());

  // Total item count
  readonly totalCount = computed(() => this._items().reduce((sum, ci) => sum + ci.quantity, 0));

  // Total cart value (uses discounted price if any)
  readonly totalValue = computed(() => this._items().reduce((sum, ci) => {
    return sum + getDiscountedPrice(ci.product) * ci.quantity;
  }, 0));

  addProduct(product: Product, quantity: number = 1) {
    if (!product || quantity <= 0) return;
    this._items.update(items => {
      const idx = items.findIndex(ci => ci.product._id === product._id);
      if (idx >= 0) {
        const updated = [...items];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + quantity };
        return updated;
      }
      return [...items, { product, quantity }];
    });
  }

  removeProduct(productId: string) {
    this._items.update(items => items.filter(ci => ci.product._id !== productId));
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeProduct(productId);
      return;
    }
    this._items.update(items => items.map(ci => ci.product._id === productId ? { ...ci, quantity } : ci));
  }

  clearCart() {
    this._items.set([]);
  }
}
