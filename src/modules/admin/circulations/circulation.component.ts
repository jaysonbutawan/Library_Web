import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { BorrowRequestDto } from './circulation.dto';
import { CirculationService } from './circulation.service';
import { takeUntil ,} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-circulation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './circulation.component.html',
})
export class CirculationComponent implements OnInit, OnDestroy {
  private circulationService = inject(CirculationService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  borrowRequests: BorrowRequestDto[] = [];
  selectedRequest: BorrowRequestDto | null = null;

  showConfirm = false;
  showRejectConfirm = false;
  isProcessing = false;

  ngOnInit(): void {
    this.loadRequests();
  }
ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
}
  loadRequests(): void {
    this.circulationService.getBorrowingHistory().subscribe({
      next: (res) => {
        this.borrowRequests = res.data.filter(
          (request: any) => request.status !== 'approved'
        );
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('[CirculationComponent] failed to load requests:', err);
      },
    });
  }
  getCountdown(request: BorrowRequestDto): string {
    if (request.status !== 'Approved' || !request.expires_at) return '';
    if (request.is_expired) return 'Expired';
    const days = request.days_remaining ?? 0;
    if (days === 0) return 'Expires today';
    if (days === 1) return 'Expires tomorrow';
    return `Expires in ${days} day${days > 1 ? 's' : ''}`;
  }


  openRejectConfirm(request: BorrowRequestDto): void {
    this.selectedRequest = request;
    this.showRejectConfirm = true;
  }

  pickupDays: number | null = 3;
  pickupPresets = [1, 3, 5, 7];

  // Update openConfirm to reset pickupDays
  openConfirm(request: BorrowRequestDto): void {
    this.selectedRequest = request;
    this.pickupDays = 3; // default to 3 days
    this.showConfirm = true;
  }

  setPickupDays(days: number): void {
    this.pickupDays = days;
  }

  getExpiryPreview(): string {
    if (!this.pickupDays || this.pickupDays < 1) return '';
    const date = new Date();
    date.setDate(date.getDate() + this.pickupDays);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  // Update approveRequest to send pickupDays to the API
  approveRequest(): void {
    if (!this.selectedRequest || !this.pickupDays) return;
    this.isProcessing = true;

    this.circulationService.approveBorrowRequest(this.selectedRequest.request_id, this.pickupDays)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showConfirm = false;
          this.isProcessing = false;
          this.showToast('Request approved successfully.', 'success');
          this.loadRequests();
        },
        error: () => {
          this.isProcessing = false;
          this.showToast('Failed to approve request.', 'error');
        }
      });
  }
  rejectRequest(): void {
    if (!this.selectedRequest) return;
    this.isProcessing = true;
    this.circulationService.rejectBorrowRequest(this.selectedRequest.request_id).subscribe({
      next: () => {
        this.selectedRequest!.status = 'cancelled   ';
        this.showRejectConfirm = false;
        this.isProcessing = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('[CirculationComponent] reject failed:', err);
        this.isProcessing = false;
        this.cdr.markForCheck();
      },
    });
  }

  getInitials(fullName: string | null): string {
    if (!fullName) return '';
    return fullName.split(' ').map((n) => n[0]).join('').toUpperCase();
  }

  showToast(message: string, type: 'success' | 'error' = 'success') {
    // For simplicity, using alert. Replace with your UI toast/snackbar later
    alert(`${type.toUpperCase()}: ${message}`);
  }
}
