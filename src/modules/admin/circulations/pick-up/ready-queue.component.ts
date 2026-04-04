import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PendingRequest {
  id: string;
  studentName: string;
  studentId: string;
  initials: string;
  bookTitle: string;
  requestDate: string;
  approvalDate: string;
  status: string;
}

@Component({
  selector: 'app-ready-queue',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ready-queue.component.html',
})
export class ReadyQueueComponent {
  pendingRequests: PendingRequest[] = [
    {
      id: '1',
      studentName: 'Elena Kordas',
      studentId: '#9928-TX',
      initials: 'EK',
      bookTitle: 'The Architecture of Silence',
      requestDate: 'Oct 12, 2024',
      approvalDate: 'Oct 14, 2024',
      status: 'Ready for Pick-up'
    },
    {
      id: '2',
      studentName: 'Julian Weaver',
      studentId: '#4412-MK',
      initials: 'JW',
      bookTitle: 'Quantum Field Dynamics',
      requestDate: 'Oct 13, 2024',
      approvalDate: 'Oct 14, 2024',
      status: 'Ready for Pick-up'
    }
  ];
}
