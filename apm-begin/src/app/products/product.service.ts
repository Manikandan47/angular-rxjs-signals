import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, concatMap, map, of, switchMap, tap, throwError } from 'rxjs';
import { Product } from './product';
import { HttpErrorService } from '../utilities/http-error.service';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Just enough here for the code to compile
  private productsUrl = 'api/products';

  // another way of injecting the service(dependency injection)
  private http = inject(HttpClient);

  private httpErrorService = inject(HttpErrorService);

  private reviewService = inject(ReviewService);
  
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl).pipe(
      tap(()=> console.log('In Http.get pipeline')),
      catchError(err => this.handleError(err))
    );
  }

  getProduct(id:number): Observable<Product>{
    const productUrl = this.productsUrl + '/' + id
    return this.http.get<Product>(productUrl)
    .pipe(
      tap(()=> console.log('In Fetching the product with its Id')),
      switchMap( product => this.getProductWithReviews(product)),
      catchError(err => this.handleError(err))
    );
  }

  private getProductWithReviews(product: Product): Observable<Product> {
    if (product.hasReviews) {
      return this.http.get<Review[]>(this.reviewService.getReviewUrl(product.id))
        .pipe(
          map(reviews => ({ ...product, reviews } as Product))
        )
    }
    else{
      return of(product);
    }
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    const formattedMessage = this.httpErrorService.formatError(err);
    return throwError((() => formattedMessage))
  }
}
