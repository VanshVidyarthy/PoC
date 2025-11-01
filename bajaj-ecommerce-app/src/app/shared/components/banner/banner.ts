import { Component } from '@angular/core';
import { ProductsList } from '../../../features/products/components/products-list/products-list';

@Component({
  selector: 'bajaj-banner',
  imports: [ProductsList],
  templateUrl: './banner.html',
  styleUrl: './banner.css',
})
export class Banner {

}
