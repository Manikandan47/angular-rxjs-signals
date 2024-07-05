import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { EMPTY, Subscription, catchError, tap } from 'rxjs';
import { ProductService } from '../product.service';

@Component({
    selector: 'pm-product-list',
    templateUrl: './product-list.component.html',
    standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent]
})
export class ProductListComponent implements OnInit, OnDestroy{

  // Just enough here for the template to compile
  pageTitle = 'Products';
  errorMessage = '';
  sub!: Subscription;

  // Products
  products: Product[] = [];

  // Selected product id to highlight the entry
  selectedProductId: number = 0;

  private productService = inject(ProductService);

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  ngOnInit(): void {
    this.sub = this.productService.getProducts()
    .pipe(
      tap(() => console.log(`In Component pipeline`)),
      catchError(
        err => {this.errorMessage = err; return EMPTY}
      )
     )
    .subscribe( {
     next: product => this.products = product
    });
  }

  onSelected(productId: number): void {
    this.selectedProductId = productId;
    
  }
}
