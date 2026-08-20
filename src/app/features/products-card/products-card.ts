import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-card.html',
  styleUrl: './products-card.css'
})
export class ProductsCard {

  @Input() producto: any;

  @Output() productClick = new EventEmitter<any>();

  @Output() addToCart = new EventEmitter<any>();

  openProduct(): void {
    this.productClick.emit(this.producto);
  }

  onAddToCart(): void {
    this.addToCart.emit(this.producto);
  }

}