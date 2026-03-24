import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { LoginResponse } from './login.dto';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StaffAuthService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/library/staff`;

  login(credentials: any): Observable<LoginResponse> {
    const headers = new HttpHeaders({
  'Accept': 'application/json' 
});
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        if (response.success && response.token) {
          localStorage.setItem('access_token', response.token);
          localStorage.setItem('user_data', JSON.stringify(response.user));
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
}