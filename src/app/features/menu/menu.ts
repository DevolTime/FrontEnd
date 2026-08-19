import { Component, OnInit, inject, TemplateRef } from '@angular/core';
import { CartFloating } from '../../shared/components/cart-floating/cart-floating';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpProducts } from '../../core/services/http-products';
import { HttpCategory } from '../../core/services/http-category';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CartFloating,
    CommonModule,
    RouterLink,
    MatDialogModule
  ],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {

  private productsService = inject(HttpProducts);
  private categoryService = inject(HttpCategory);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);

  products$: Observable<any[]> = this.productsService.products$;
  productsList: any[] = [];
  selectedCategoryId: string | null = null;
  private productSnapshot: any[] = [];
  titleCategory$ = new BehaviorSubject<string>('');

  ngOnInit(): void {

    this.productsService.loadproducts();

    this.productsService.products$.subscribe((items) => {
      this.productSnapshot = items;
      this.productsList = this.filterProducts(items);
    });

    this.route.paramMap.subscribe((params) => {
      this.selectedCategoryId = params.get('categoryId');
      this.productsList = this.filterProducts(this.productSnapshot);

      if (this.selectedCategoryId) {
        this.categoryService.getCategoryById(this.selectedCategoryId).subscribe({
          next: (res) => {
            console.log(res);
            this.titleCategory$.next(res.data.name);
          },
          error: (err) => {
            console.error(err);
          },
        });
      } else {
        this.titleCategory$.next('');
      }
    });
  }

  private filterProducts(list: any[]): any[] {

    if (!this.selectedCategoryId) {
      return list;
    }

    return list.filter((product: any) => {

      const categoryValue = product.category;

      if (!categoryValue) {
        return false;
      }

      return (
        categoryValue === this.selectedCategoryId ||
        categoryValue?._id === this.selectedCategoryId ||
        categoryValue?.id === this.selectedCategoryId ||
        categoryValue?.name === this.selectedCategoryId
      );
    });
  }

  handleImageError(event: Event): void {

    const imgElement = event.target as HTMLImageElement;

    imgElement.src = 'assets/images/placeholder.png';
  }

  openProduct(
    product: any,
    template: TemplateRef<any>
  ): void {

    this.dialog.open(template, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '95vh',
      panelClass: 'product-dialog',
      data: product
    });
  }
}