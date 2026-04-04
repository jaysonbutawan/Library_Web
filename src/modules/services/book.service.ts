import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Book, BookCreateRequest, BookFilters, BookResponse } from './models/book.model';

@Injectable({ providedIn: 'root' })
export class BookService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/books`;

  getBooks(filters: BookFilters = {}): Observable<BookResponse> {
    const params: Record<string, string> = {};
    if (filters.cursor) params['cursor'] = filters.cursor;
    if (filters.search) params['search'] = filters.search;
    if (filters.category != null) params['category'] = String(filters.category);
    if (filters.status && filters.status !== 'all') params['status'] = filters.status;
    return this.http.get<BookResponse>(this.apiUrl, { params });
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  addBook(book: BookCreateRequest): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

 updateBook(id: number, changes: Partial<Book>): Observable<Book> {
  return this.http.patch<Book>(`${this.apiUrl}/${id}`, changes);
}

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
