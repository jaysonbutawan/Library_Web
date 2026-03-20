import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

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

  history = [
    { 
      id: 1, title: 'The Art of Resilience', author: 'Marcus Aurelius Trans.', 
      borrowDate: 'Oct 12, 2023', dueDate: 'Oct 26, 2023', subDate: '12 DAYS LATE', 
      status: 'Overdue', fine: 12.50, fineNote: 'Overdue', color: '#1ea8e0', isOverdue: true 
    },
    { 
      id: 2, title: 'Digital Minimalism', author: 'Cal Newport', 
      borrowDate: 'Jan 05, 2024', dueDate: 'Jan 19, 2024', subDate: '4 DAYS LEFT', 
      status: 'Active', fine: 0.00, fineNote: 'Active', color: '#f5f5f5', isOverdue: false 
    },
    { 
      id: 3, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', 
      borrowDate: 'Dec 01, 2023', dueDate: 'Dec 15, 2023', subDate: 'Returned', 
      status: 'Returned', fine: 2.00, fineNote: 'PAID', color: '#8b4513', isOverdue: false 
    },
    { 
      id: 4, title: 'Design Systems Handbook', author: 'InVision', 
      borrowDate: 'Jan 10, 2024', dueDate: 'Jan 24, 2024', subDate: '9 DAYS LEFT', 
      status: 'Active', fine: 0.00, fineNote: 'Active', color: '#ffd700', isOverdue: false 
    }
  ];
}