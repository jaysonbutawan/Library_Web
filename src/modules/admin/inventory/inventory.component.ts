import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { BookAsset } from "./inventory.component.dto";


@Component({
  selector: "app-inventory",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./inventory.component.html",
})
export class InventoryComponent {
    books: BookAsset[] = [
    {
      id: '1',
      title: 'The Architecture of Reason',
      classification: 'Philosophy',
      isbn: 'ISBN-978-3-16-148418-8',
      status: 'AVAILABLE',
      isActive: true,
      coverColor: 'bg-amber-100'
    },
    {
      id: '2',
      title: 'Visions of the Voids',
      classification: 'Digital Art',
      isbn: 'ISBN-978-0-12-345678-9',
      status: 'RESERVED',
      isActive: false,
      coverColor: 'bg-emerald-100'
    }
  ];

  get totalRecords(): string {
    return this.books.length.toLocaleString();
  }
}