import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';

export interface Category {
  category_id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/library/categories`;

  getCategories(): Observable<Category[]> {
    console.log('📡 Fetching categories from:', this.API_URL);
    return this.http.get<Category[]>(this.API_URL).pipe(
      tap((categories) => {
        if (categories && categories.length > 0) {
          console.log(`✅ Successfully fetched ${categories.length} categories.`);
        } else {
          console.warn('⚠️ Request successful, but no categories found.');
        }
      }),
      catchError((error) => {
        console.error('❌ Failed to fetch categories:', error);
        return throwError(() => error);
      })
    );
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.API_URL}/${id}`).pipe(
      tap(cat => console.log(`📂 Retrieved category: ${cat.name} (ID: ${id})`)),
      catchError(err => {
        console.error(`🚫 Error fetching category ID ${id}:`, err.message);
        return throwError(() => err);
      })
    );
  }

  addCategory(data: { name: string }): Observable<Category> {
    return this.http.post<Category>(this.API_URL, data).pipe(
      tap(cat => console.log(`✅ Category created: ${cat.name}`)),
      catchError(err => {
        console.error('❌ Failed to create category:', err.message);
        return throwError(() => err);
      })
    );
  }

  updateCategory(id: number, data: { name: string }): Observable<Category> {
    return this.http.put<Category>(`${this.API_URL}/${id}`, data).pipe(
      tap(cat => console.log(`✅ Category updated: ${cat.name} (ID: ${id})`)),
      catchError(err => {
        console.error(`❌ Failed to update category ID ${id}:`, err.message);
        return throwError(() => err);
      })
    );
  }

  deleteCategory(id: number): Observable<Category> {
    return this.http.delete<Category>(`${this.API_URL}/${id}`).pipe(
      tap(() => console.log(`🗑️ Category deleted (ID: ${id})`)),
      catchError(err => {
        console.error(`❌ Failed to delete category ID ${id}:`, err.message);
        return throwError(() => err);
      })
    );
  }
}