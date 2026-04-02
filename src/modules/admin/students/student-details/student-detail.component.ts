import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { StudentService } from "../student.service";
import { StudentDto } from "../student.dto";

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
  styleUrl: './student-detail.component.css'
})
export class StudentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentService = inject(StudentService);
  private cdr = inject(ChangeDetectorRef); // 2. Inject it

  student: StudentDto | null = null;
  isLoading = true;
  errorMessage = '';

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

  ngOnInit() {
    const navigation = this.router.currentNavigation();
    const passedStudent = navigation?.extras?.state?.['student'];

    if (passedStudent) {
      this.student = passedStudent;
      this.isLoading = false;
      this.cdr.detectChanges(); // 3. Force check if passed via state
      return;
    }

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/admin/students']);
      return;
    }

    this.studentService.getStudentById(id).subscribe({
      next: (data) => {
        this.student = data;
        this.isLoading = false;
        this.cdr.detectChanges(); // 4. Force check after API call
      },
      error: (err) => {
        this.errorMessage = 'Failed to load student';
        this.isLoading = false;
        this.cdr.detectChanges(); // 5. Force check on error
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/students']);
  }

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

        if (this.student) {
          this.student = {
            ...this.student,
            current_books: Math.max(0, this.student.current_books - 1),
            fines: this.student.fines + calculatedFine
          };
        }
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
