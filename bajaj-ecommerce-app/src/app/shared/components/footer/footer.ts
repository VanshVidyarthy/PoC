import { Component } from '@angular/core';

@Component({
  selector: 'bajaj-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  readonly year = new Date().getFullYear();
}
