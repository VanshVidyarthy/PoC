import { Injectable, signal, computed } from '@angular/core';

/**
 * Global SearchService managing a single search query across the application.
 * Current implementation performs client-side filtering in individual components.
 * Can be extended for server-side searching by adding HTTP calls and exposing results.
 */
@Injectable({ providedIn: 'root' })
export class SearchService {
  // Raw query
  readonly query = signal<string>('');

  // Normalized version used by filters
  readonly normalized = computed(() => this.query().trim().toLowerCase());

  setQuery(value: string) {
    const val = (value || '').slice(0, 200); // safety cap
    if (val !== this.query()) {
      console.log('[SearchService] setQuery ->', val);
      this.query.set(val);
    }
  }

  clear() {
    if (this.query()) {
      console.log('[SearchService] clear');
      this.query.set('');
    }
  }
}
