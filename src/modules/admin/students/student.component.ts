import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Student {
  id: number;
  name: string;
  studentId: string;
  department: string;
  totalBorrowed: number;
  currentBooks: number;
  fines: number;
  avatar: string;
}

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student.component.html'
})
export class StudentsComponent implements OnInit {
  students: Student[] = [
    { id: 1, name: 'Sarah J. Rize', studentId: '10032001', department: 'CCS', totalBorrowed: 23, currentBooks: 3, fines: 0, avatar: 'assets/avatars/1.jpg' },
    { id: 2, name: 'Jayzn Butawan', studentId: '10032003', department: 'COE', totalBorrowed: 20, currentBooks: 3, fines: 15.00, avatar: 'assets/avatars/2.jpg' },
    { id: 3, name: 'Jayson Butawan', studentId: '10032004', department: 'CBA', totalBorrowed: 23, currentBooks: 3, fines: 15.00, avatar: 'assets/avatars/3.jpg' },
    { id: 4, name: 'Kathlen Iolarah', studentId: '10032005', department: 'CCS', totalBorrowed: 16, currentBooks: 4, fines: 0, avatar: 'assets/avatars/4.jpg' },
    { id: 5, name: 'Sarah J. Rize', studentId: '10032006', department: 'CASS', totalBorrowed: 23, currentBooks: 3, fines: 0, avatar: 'assets/avatars/1.jpg' },
    { id: 6, name: 'Jayzn Butawan', studentId: '10032007', department: 'CED', totalBorrowed: 20, currentBooks: 3, fines: 15.00, avatar: 'assets/avatars/2.jpg' },
    { id: 7, name: 'Jayson Butawan', studentId: '10032008', department: 'CSM', totalBorrowed: 23, currentBooks: 3, fines: 15.00, avatar: 'assets/avatars/3.jpg' },
    { id: 8, name: 'aaaaaaaaaaa', studentId: '10032009', department: 'CON', totalBorrowed: 16, currentBooks: 4, fines: 0, avatar: 'assets/avatars/4.jpg' },
  ];

  readonly PAGE_SIZE = 12;

  searchQuery = '';
  statusFilter = 'all';
  departmentFilter = 'all';
  currentPage = 1;

  filteredStudents: Student[] = [];
  pagedStudents: Student[] = [];
  totalPages = 1;
  visiblePages: (number | string)[] = [];
  rangeStart = 0;
  rangeEnd = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    this.applyFilters();
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
        s.name.toLowerCase().includes(query) ||
        s.studentId.toLowerCase().includes(query);

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