import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BorrowedBook {
  id: string;
  title: string;
  author: string;
  borrowDate: Date;
  dueDate: Date;
  status: 'ACTIVE' | 'DUE_SOON' | 'OVERDUE';
  fine: number; // 0 if no fine
  iconSvg: string;
}

@Component({
  selector: 'app-borrowed-books',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './borrowed-books.component.html',
})
export class BorrowedBooksComponent implements OnInit {
  // Filters
  filters = ['ALL ACTIVE', 'DUE SOON', 'OVERDUE & FINES'];
  activeFilter = 'ALL ACTIVE';

  // Raw data from backend
  allBorrowedBooks: BorrowedBook[] = [];

  // Data currently displayed based on filter
  displayedBooks: BorrowedBook[] = [];

  // Summary Stats
  totalFines = 0;
  overdueCount = 0;

  ngOnInit() {
    // Mock backend data
    const today = new Date();

    this.allBorrowedBooks = [
      {
        id: '101',
        title: 'Advanced System Architecture',
        author: 'Sarah Jenkins, PhD',
        borrowDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10),
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14),
        status: 'ACTIVE',
        fine: 0,
        iconSvg: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'
      },
      {
        id: '102',
        title: 'The Digital Economy',
        author: 'Dr. Elena Vance',
        borrowDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 25),
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
        status: 'DUE_SOON',
        fine: 0,
        iconSvg: 'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'
      },
      {
        id: '103',
        title: 'Lexicon of Modern Art',
        author: 'Academy Press',
        borrowDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 40),
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 10),
        status: 'OVERDUE',
        fine: 15.50,
        iconSvg: 'M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8z'
      }
    ];

    this.calculateStats();
    this.applyFilter(this.activeFilter);
  }

  calculateStats() {
    this.totalFines = this.allBorrowedBooks.reduce((sum, book) => sum + book.fine, 0);
    this.overdueCount = this.allBorrowedBooks.filter(b => b.status === 'OVERDUE').length;
  }

  applyFilter(filter: string) {
    this.activeFilter = filter;

    if (filter === 'ALL ACTIVE') {
      this.displayedBooks = [...this.allBorrowedBooks];
    } else if (filter === 'DUE SOON') {
      this.displayedBooks = this.allBorrowedBooks.filter(b => b.status === 'DUE_SOON' || b.status === 'OVERDUE');
    } else if (filter === 'OVERDUE & FINES') {
      this.displayedBooks = this.allBorrowedBooks.filter(b => b.status === 'OVERDUE' || b.fine > 0);
    }
  }

  // Helper for template formatting
  getDaysRemaining(dueDate: Date): number {
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
