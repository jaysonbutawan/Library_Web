import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { LoginResponse, RegisterResponse } from './login.dto';

@Injectable({
  providedIn: 'root'
})
export class StaffAuthService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/auth`;

login(credentials: any): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
    tap(response => {
      if (response.success && response.data?.token) {
        localStorage.setItem('access_token', response.data.token);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
      }
    }),
    catchError(error => {
      // If Laravel returns validation errors, we extract them
      if (error.status === 422 && error.error.errors) {
        const firstErrorKey = Object.keys(error.error.errors)[0];
        const customMsg = error.error.errors[firstErrorKey][0];
        // Create a new error object that the component can easily read
        return throwError(() => ({ ...error, customMessage: customMsg }));
      }
      return throwError(() => error);
    })
  );
}

  register(data: any): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.API_URL}/register`, data);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
}
