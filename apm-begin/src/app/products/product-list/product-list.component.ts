import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { EMPTY, Subscription, catchError, tap } from 'rxjs';
import { ProductService } from '../product.service';

@Component({
    selector: 'pm-product-list',
    templateUrl: './product-list.component.html',
    standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent, AsyncPipe]
})
export class ProductListComponent {

  // Just enough here for the template to compile
  pageTitle = 'Products';
  errorMessage = '';

  private productService = inject(ProductService);

  // Selected product id to highlight the entry
  readonly selectedProductId$ = this.productService.productSelected$;

  readonly products$ = this.productService.products$
  .pipe(
    tap(() => console.log(`In Component pipeline`)),
    catchError(
      err => {this.errorMessage = err; return EMPTY}
    )
   );

  onSelected(productId: number): void {
    this.productService.productSelected(productId);
  }
}
