import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Book } from './book.dto';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/library/books`;

 getBooks(): Observable<Book[]> {
    console.log('📡 Fetching books from:', this.API_URL); // Log before request
    
    return this.http.get<Book[]>(this.API_URL).pipe(
      tap((books) => {
        if (books && books.length > 0) {
          console.log(`✅ Successfully fetched ${books.length} books.`);
        } else {
          console.warn('⚠️ Request successful, but the library inventory is empty.');
        }
      }),
      catchError((error) => {
        console.error('❌ Failed to fetch books:', error);
        return throwError(() => error);
      })
    );
  }

  // Example of detailed logging for a specific book
  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.API_URL}/${id}`).pipe(
      tap(book => console.log(`📖 Retrieved book: ${book.title} (ID: ${id})`)),
      catchError(err => {
        console.error(`🚫 Error fetching book ID ${id}:`, err.message);
        return throwError(() => err);
      })
    );
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.API_URL, book);
  }

  updateBook(id: number, book: Partial<Book>): Observable<Book> {
    return this.http.put<Book>(`${this.API_URL}/${id}`, book);
  }

  deleteBook(id: number): Observable<Book> {
    return this.http.delete<Book>(`${this.API_URL}/${id}`);
  }
}