import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StudentService } from './student.service';
import { StudentDto } from './student.dto';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student.component.html'
})
export class StudentsComponent implements OnInit {
  private studentService = inject(StudentService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);


  students: StudentDto[] = [];

  nextCursor: string | null = null;
  prevCursor: string | null = null;

  isLoading = false;
  errorMessage = '';


  ngOnInit() {
    this.loadStudents();
  }

  loadStudents(cursor: string | null = null) {
    this.isLoading = true;

    this.studentService.getStudents(
      cursor,
      this.searchQuery,
      this.departmentFilter,
      this.statusFilter
    ).subscribe({
      next: (res) => {
        console.log('📡 API Response:', res);

        this.students = res.data;
        this.nextCursor = res.meta.next_cursor;
        this.prevCursor = res.meta.prev_cursor;

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load students';
        this.isLoading = false;
      }
    });
  }

  nextPage() {
    if (this.nextCursor) {
      this.loadStudents(this.nextCursor);
    }
  }

  prevPage() {
    if (this.prevCursor) {
      this.loadStudents(this.prevCursor);
    }
  }

  navigateToDetails(id: number) {
    this.router.navigate(['/admin/students', id]);
  }
onSearch() {
  this.loadStudents();
}
  statusFilter: 'all' | 'clear' | 'fines' = 'all';
  searchQuery: string = '';

  setStatusFilter(status: 'all' | 'clear' | 'fines') {
    this.statusFilter = status;
    this.onSearch();
  }
  departmentFilter: string = '';

  setDepartmentFilter(department: string) {
    this.departmentFilter = department;
    this.onSearch();
  }
}
