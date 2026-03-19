import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";


@Component({
    selector: "app-circulation",
    imports: [CommonModule, RouterLink,],
    standalone : true,
    templateUrl: "./circulation.component.html",

})
export class CirculationComponent {
   showConfirm = false;
  selectedRequest: any = null;

  borrowRequests = [
    { id: 1, studentName: 'Marcus Thorne', studentInitials: 'MT', bookTitle: 'The Iron Protocol', date: '2026-03-15', status: 'Pending' },
    { id: 2, studentName: 'Sarah Jenkins', studentInitials: 'SJ', bookTitle: 'Visions of Void', date: '2026-03-14', status: 'Approved' },
    { id: 3, studentName: 'Jayson Butawan', studentInitials: 'JB', bookTitle: 'Angular Masterclass', date: '2026-03-14', status: 'Pending' },
    { id: 4, studentName: 'Elena Kostas', studentInitials: 'EK', bookTitle: 'Digital Ethics', date: '2026-03-12', status: 'Rejected' },
  ];

  openConfirm(request: any) {
    this.selectedRequest = request;
    this.showConfirm = true;
  }

  approveRequest() {
    if (this.selectedRequest) {
      this.selectedRequest.status = 'Approved';
    }
    this.showConfirm = false;
  }
}