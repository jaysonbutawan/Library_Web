import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs'; 
import { environment } from '../../../../environments/environment.development'; 
import { Book } from './book.dto'; 

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);
  
  private readonly API_URL = `${environment.apiUrl}/library/books`;

  getBooks(id?: number): Observable<Book | Book[]> {
    const url = id ? `${this.API_URL}/${id}` : this.API_URL;
    return this.http.get<Book | Book[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.API_URL, book).pipe(
      catchError(this.handleError)
    );
  }

  updateBook(id: number, book: Partial<Book>): Observable<Book> {
    return this.http.put<Book>(`${this.API_URL}/${id}`, book).pipe(
      catchError(this.handleError)
    );
  }

  deleteBook(id: number): Observable<Book> {
    return this.http.delete<Book>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    let errorMessage = 'An unexpected error occurred.';
    
    if (error.status === 422) {
      const validationErrors = error.error.errors;
      errorMessage = Object.values(validationErrors).flat().join(', ');
    } else if (error.status === 401) {
      errorMessage = 'Session expired. Please login again.';
    } else if (error.status === 404) {
      errorMessage = 'The requested book was not found.';
    }

    console.error(`[BookService Error]: ${errorMessage}`);
    return throwError(() => new Error(errorMessage));
  }
}