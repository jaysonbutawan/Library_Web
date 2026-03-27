import { Component, OnInit, inject } from '@angular/core';
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

  students: StudentDto[] = [];

  readonly PAGE_SIZE = 12;

  searchQuery = '';
  statusFilter = 'all';
  departmentFilter = 'all';
  currentPage = 1;

  filteredStudents: StudentDto[] = [];
  pagedStudents: StudentDto[] = [];
  totalPages = 1;
  visiblePages: (number | string)[] = [];
  rangeStart = 0;
  rangeEnd = 0;

  isLoading = true;
  errorMessage = '';

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.isLoading = true;
    this.errorMessage = '';

    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load students';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  navigateToDetails(id: number) {
    this.router.navigate(['/admin/students', id]);
  }

  onSearch() {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters() {
    const query = this.searchQuery.toLowerCase().trim();

    this.filteredStudents = this.students.filter(s => {
      const matchesSearch = !query ||
        s.full_name.toLowerCase().includes(query) ||
        s.student_id.toString().toLowerCase().includes(query);

      const matchesStatus =
        this.statusFilter === 'all' ||
        (this.statusFilter === 'fines' && s.fines > 0) ||
        (this.statusFilter === 'clear' && s.fines === 0);

      const matchesDepartment =
        this.departmentFilter === 'all' ||
        s.department === this.departmentFilter;

      return matchesSearch && matchesStatus && matchesDepartment;
    });

    this.totalPages = Math.max(1, Math.ceil(this.filteredStudents.length / this.PAGE_SIZE));
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    this.updatePage();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePage();
  }

  updatePage() {
    const start = (this.currentPage - 1) * this.PAGE_SIZE;
    const end = start + this.PAGE_SIZE;
    this.pagedStudents = this.filteredStudents.slice(start, end);
    this.rangeStart = this.filteredStudents.length === 0 ? 0 : start + 1;
    this.rangeEnd = Math.min(end, this.filteredStudents.length);
    this.buildVisiblePages();
  }

  buildVisiblePages() {
    const pages: (number | string)[] = [];
    const total = this.totalPages;
    const cur = this.currentPage;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (cur > 3) pages.push('...');
      for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i);
      if (cur < total - 2) pages.push('...');
      pages.push(total);
    }

    this.visiblePages = pages;
  }
}
