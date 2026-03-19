import { Component, OnInit } from "@angular/core";
import { CommonModule, NgClass } from "@angular/common";
import { FormsModule } from "@angular/forms"; 
import { BookAsset } from "./inventory.component.dto";
import { AddbookModalComponent } from "./modal/addbook-modal.component";

@Component({
  selector: "app-inventory",
  standalone: true,
  imports: [CommonModule, NgClass, FormsModule, AddbookModalComponent],
  templateUrl: "./inventory.component.html",
})
export class InventoryComponent implements OnInit {
  searchTerm: string = '';
  
  allBooks: BookAsset[] = [
    {
      id: '1',
      title: 'The Architecture of Reason',
      category: 'Philosophy',
      author: 'Elena Kostas',
      isbn: 'ISBN-978-3-16-148418-8',
      total_copies: 10,
      available_copies: 5,
      status: 'AVAILABLE',
      isActive: true,
      coverColor: 'bg-amber-100'
    },
    {
      id: '2',
      title: 'Visions of the Void',
      category: 'Digital Art',
      author: 'Marcus Thorne',
      isbn: 'ISBN-978-0-12-345678-9',
      total_copies: 25,
      available_copies: 2,
      status: 'RESERVED',
      isActive: false,
      coverColor: 'bg-emerald-100'
    }
  ];

  filteredBooks: BookAsset[] = [];

  ngOnInit() {
    this.filteredBooks = this.allBooks;
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredBooks = this.allBooks;
      return;
    }

    this.filteredBooks = this.allBooks.filter(book => 
      book.title.toLowerCase().includes(term) || 
      book.author.toLowerCase().includes(term)
    );
  }

  get totalRecords(): string {
    return this.filteredBooks.length.toLocaleString();
  }
  getAvailabilityControl(book: BookAsset): number {
  if (!book || !book.total_copies) return 0;
  return (book.available_copies / book.total_copies) * 100;
}

isModalOpen = false;

toggleModal() {
  this.isModalOpen = !this.isModalOpen;
}
}