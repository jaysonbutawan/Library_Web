import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { StudentDto } from './student.dto';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/students`;

  getStudents(cursor: string | null = null): Observable<any> {
    let url = this.API_URL;

    if (cursor) {
      url += `?cursor=${cursor}`;
    }

    return this.http.get<any>(url);
  }

  getStudentById(id: number): Observable<StudentDto> {
    return this.http.get<StudentDto>(`${this.API_URL}/${id}`);
  }
}
