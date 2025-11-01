import { Injectable, signal, computed } from '@angular/core';

export interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timeout: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _messages = signal<ToastMessage[]>([]);
  private _counter = 0;

  readonly messages = computed(() => this._messages());

  show(text: string, type: ToastMessage['type'] = 'info', timeout: number = 4000) {
    const id = ++this._counter;
    const msg: ToastMessage = { id, text, type, timeout };
    this._messages.update(list => [...list, msg]);
    if (timeout > 0) {
      setTimeout(() => this.dismiss(id), timeout);
    }
  }

  dismiss(id: number) {
    this._messages.update(list => list.filter(m => m.id !== id));
  }

  clear() {
    this._messages.set([]);
  }
}