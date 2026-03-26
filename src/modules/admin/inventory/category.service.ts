import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
        return this.http.get<Category[]>(this.API_URL).pipe(
        );
    }

    getCategoryById(id: number): Observable<Category> {
        return this.http.get<Category>(`${this.API_URL}/${id}`).pipe();
    }

    addCategory(data: { name: string }): Observable<Category> {
        return this.http.post<Category>(this.API_URL, data).pipe();
    }

    updateCategory(id: number, data: { name: string }): Observable<Category> {
        return this.http.put<Category>(`${this.API_URL}/${id}`, data).pipe();
    }

    deleteCategory(id: number): Observable<Category> {
        return this.http.delete<Category>(`${this.API_URL}/${id}`).pipe();
    }
}