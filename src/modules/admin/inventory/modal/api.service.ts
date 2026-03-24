import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Book } from './book.dto';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/library/books`;

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.API_URL);
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.API_URL}/${id}`);
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