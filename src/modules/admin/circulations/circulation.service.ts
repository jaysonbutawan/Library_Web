import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { BorrowRequestResponseDto } from './circulation.dto';

@Injectable({
  providedIn: 'root'
})
export class CirculationService {

  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/borrow`;

 getBorrowingHistory(): Observable<BorrowRequestResponseDto> {
  return this.http.get<BorrowRequestResponseDto>(
    `${this.API_URL}/requests`
  );
}

approveBorrowRequest(requestId: number, pickupDays: number): Observable<void> {
  return this.http.patch<void>(
    `${this.API_URL}/requests/${requestId}/approve`,
    { pickup_days: pickupDays }
  );
}

rejectBorrowRequest(requestId: number): Observable<void> {
  return this.http.patch<void>(
    `${this.API_URL}/requests/${requestId}/reject`,
    {}
  );
}

}
