import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { StudentDto, StudentResponse } from './student.dto';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/students`;

getStudents(
  cursor: string | null = null,
  search: string = '',
  department: string = 'all',
  status: string = 'all'
): Observable<StudentResponse> {

  let params: any = {};

  if (cursor) params.cursor = cursor;
  if (search) params.search = search;
  if (department !== 'all') params.department = department;
  if (status !== 'all') params.status = status;

  return this.http.get<StudentResponse>(this.API_URL, { params });
}

  getStudentById(id: number): Observable<StudentDto> {
    return this.http.get<StudentDto>(`${this.API_URL}/${id}`);
  }
}
