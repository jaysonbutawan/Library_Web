import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { BorrowRequestDto } from "./circulation.dto";
import { CirculationService } from "./circulation.service";

@Component({
  selector: "app-circulation",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./circulation.component.html",
})
export class CirculationComponent implements OnInit {

  // ✅ inject service properly
  private circulationService = inject(CirculationService);

  showConfirm = false;
  selectedRequest: BorrowRequestDto | null = null;

  borrowRequests: BorrowRequestDto[] = [];

  ngOnInit(): void {

    this.circulationService.getBorrowingHistory().subscribe({
      next: (res) => {
        console.log('✅ API Response:', res);

        this.borrowRequests = res.data;

        console.log('📦 Typed Requests:', this.borrowRequests);
      },
      error: (err) => {
        console.error('❌ API Error:', err);
      }
    });
  }

  openConfirm(request: BorrowRequestDto) {
    this.selectedRequest = request;
    this.showConfirm = true;
  }

  approveRequest() {
    if (this.selectedRequest) {
      this.selectedRequest.status = 'Approved';
    }
    this.showConfirm = false;
  }

  getInitials(fullName: string | null): string {
  if (!fullName) return '';

  return fullName
    .split(' ')               // split by space
    .map(n => n[0])           // take first letter of each part
    .join('')                 // join letters
    .toUpperCase();           // convert to uppercase
}
}
