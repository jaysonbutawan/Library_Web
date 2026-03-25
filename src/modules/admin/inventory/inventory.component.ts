import { Component, OnInit, inject, ChangeDetectorRef } from "@angular/core";
import { CommonModule, NgClass } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Book } from "./book.dto";
import { AddbookModalComponent } from "./modal/addbook-modal.component";
import { BookService } from "./api.service";

@Component({
  selector: "app-inventory",
  standalone: true,
  imports: [CommonModule, NgClass, FormsModule, AddbookModalComponent],
  templateUrl: "./inventory.component.html",
})
export class InventoryComponent implements OnInit {
  private bookService = inject(BookService);
  private cdr = inject(ChangeDetectorRef);
  searchTerm: string = '';
  allBooks: Book[] = [];
  filteredBooks: Book[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.isLoading = true;
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.allBooks = books;
        this.filteredBooks = [...books]; 
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading books:', err);
        this.showToast('Failed to load books.', 'error');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredBooks = [...this.allBooks];
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

  getAvailabilityControl(book: Book): number {
    if (!book || !book.total_copies) return 0;
    return (book.available_copies / book.total_copies) * 100;
  }

  isModalOpen = false;
  selectedBook: Book | undefined = undefined;

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
    if (!this.isModalOpen) this.selectedBook = undefined;
  }

  openEditModal(book: Book) {
    this.selectedBook = book;
    this.isModalOpen = true;
  }

  toastMessage: { text: string; type: 'success' | 'error' } | null = null;

  showToast(text: string, type: 'success' | 'error') {
    this.toastMessage = { text, type };
    setTimeout(() => this.toastMessage = null, 3000);
  }

  onBookSaved(book: Book) {
    const wasEditing = !!this.selectedBook;
    this.isModalOpen = false;
    this.selectedBook = undefined;
    this.showToast(
      wasEditing ? 'Book updated successfully!' : 'Book added successfully!',
      'success'
    );
    this.loadBooks();
  }

  toggleStatus(book: Book) {
  const newStatus = book.status === 'available' ? 'maintenance' : 'available';
  this.bookService.updateBook(book.book_id!, { status: newStatus }).subscribe({
    next: () => {
      book.status = newStatus;
      this.cdr.detectChanges();
      this.showToast(
        newStatus === 'available' ? 'Book marked as available.' : 'Book marked as unavailable.',
        'success'
      );
    },
    error: () => this.showToast('Failed to update status.', 'error')
  });
}

deleteBook(book: Book) {
  if (!confirm(`Delete "${book.title}"? This cannot be undone.`)) return;
  this.bookService.deleteBook(book.book_id!).subscribe({
    next: () => {
      this.showToast('Book deleted successfully.', 'success');
      this.loadBooks();
    },
    error: () => this.showToast('Failed to delete book.', 'error')
  });
}
}