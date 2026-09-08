import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpCategory } from '../../core/services/http-category';
import { HttpProducts } from '../../core/services/http-products';
import { RouterLink } from '@angular/router';
import { CartFloating } from '../../shared/components/cart-floating/cart-floating';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, RouterLink, CartFloating],
  templateUrl: './categoria.html',
  styleUrl: './categoria.css',
})
export class Categoria implements OnInit {
  private categoryService = inject(HttpCategory);
  private productsService = inject(HttpProducts);

  categories$: Observable<any[]> = this.categoryService.categories$;
  products$: Observable<any[]> = this.productsService.products$;

  ngOnInit(): void {
    this.categoryService.loadCategory();
    this.productsService.loadproducts();
  }

  productMatchesCategory(product: any, category: any): boolean {
    const categoryId = category?._id ?? category?.id;
    const productCategory = product?.category;

    if (!categoryId || !productCategory) {
      return false;
    }

    return (
      productCategory === categoryId ||
      productCategory?._id === categoryId ||
      productCategory?.id === categoryId ||
      productCategory?.name === category?.name
    );
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/placeholder.png';
  }
}