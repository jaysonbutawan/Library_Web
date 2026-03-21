import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

export interface BorrowHistory {
  id: number;
  title: string;
  author: string;
  borrowDate: string;
  dueDate: string;
  subDate: string;
  status: 'Active' | 'Overdue' | 'Returned';
  isOverdue: boolean;
  fine: number;
  fineNote: string;
  color: string;
}

@Component({
  selector: 'app-student-detail',
  imports: [CommonModule],
  templateUrl: './student-detail.component.html',
})
export class StudentDetailComponent {

  student = {
    name: 'Julian Thorne',
    avatar: 'assets/avatars/julian.jpg',
    studentId: 'STU-8829-2024',
    level: 'Graduate Student',
    faculty: 'Faculty of Letters',
    balance: 14.50,
    activeBorrows: 3,
    totalBorrowed: 12,
    joinDate: 'September 2023'
  };

  history: BorrowHistory[] = [
    {
      id: 1, title: 'The Art of Resilience', author: 'Marcus Aurelius Trans.',
      borrowDate: 'Oct 12, 2023', dueDate: '10/26/2023', subDate: '12 DAYS LATE',
      status: 'Overdue', fine: 12.50, fineNote: 'Overdue', color: '#1ea8e0', isOverdue: true
    },
    {
      id: 2, title: 'Digital Minimalism', author: 'Cal Newport',
      borrowDate: 'Jan 05, 2024', dueDate: '01/19/2024', subDate: '4 DAYS LEFT',
      status: 'Active', fine: 0.00, fineNote: 'Active', color: '#f5f5f5', isOverdue: false
    },
    {
      id: 3, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald',
      borrowDate: 'Dec 01, 2023', dueDate: '12/15/2023', subDate: 'Returned',
      status: 'Returned', fine: 2.00, fineNote: 'PAID', color: '#8b4513', isOverdue: false
    },
    {
      id: 4, title: 'Design Systems Handbook', author: 'InVision',
      borrowDate: 'Jan 10, 2024', dueDate: '01/24/2024', subDate: '9 DAYS LEFT',
      status: 'Active', fine: 0.00, fineNote: 'Active', color: '#ffd700', isOverdue: false
    }
  ];

  showReturnModal = false;
  selectedReturnItem: BorrowHistory | null = null;
  isReturning = false;
  returnSuccessId: number | null = null;

  readonly FINE_PER_DAY = 5;

  openReturnConfirm(item: BorrowHistory): void {
    this.selectedReturnItem = item;
    this.showReturnModal = true;
  }

  cancelReturn(): void {
    this.showReturnModal = false;
    this.selectedReturnItem = null;
  }

  returnBook(item: BorrowHistory): void {
    if (this.isReturning) return;
    this.isReturning = true;

    const today = new Date();
    const [month, day, year] = item.dueDate.split('/').map(Number);
    const dueDate = new Date(year, month - 1, day);

    const isOverdue = today > dueDate;
    const overdueDays = isOverdue
      ? Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    const calculatedFine = overdueDays * this.FINE_PER_DAY;

    // Simulate API call — replace setTimeout with your real service call
    setTimeout(() => {
      const index = this.history.findIndex(h => h.id === item.id);
      if (index !== -1) {
        this.history[index] = {
          ...this.history[index],
          status: 'Returned',
          isOverdue: false,
          fine: calculatedFine,
          fineNote: calculatedFine > 0 ? `${overdueDays}d overdue` : 'No fine',
          subDate: `Returned ${today.toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          })}`
        };

        // Update student stats
        this.student.activeBorrows = Math.max(0, this.student.activeBorrows - 1);
        this.student.balance += calculatedFine;
      }

      this.returnSuccessId = item.id;
      this.isReturning = false;
      this.showReturnModal = false;
      this.selectedReturnItem = null;

      setTimeout(() => { this.returnSuccessId = null; }, 3000);
    }, 800);
  }

  formatDueDate(dueDateStr: string): string {
    const [month, day, year] = dueDateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}