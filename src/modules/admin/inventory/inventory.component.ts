import { Component, OnInit, inject, ChangeDetectorRef } from "@angular/core";
import { CommonModule, NgClass } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Book } from "./book.dto";
import { AddbookModalComponent } from "./modal/addbook-modal.component";
import { BookService } from "./book.service";
import { CategoryFilterComponent } from "./category-filter.component";
import { Category } from "./category.service";

@Component({
  selector: "app-inventory",
  standalone: true,
  imports: [CommonModule, NgClass, FormsModule, AddbookModalComponent, CategoryFilterComponent],
  templateUrl: "./inventory.component.html",
})
export class InventoryComponent implements OnInit {
  private bookService = inject(BookService);
  private cdr = inject(ChangeDetectorRef);

  // Book data
  allBooks: Book[] = [];
  filteredBooks: Book[] = [];
  paginatedBooks: Book[] = [];
  isLoading = true;

  // Filters
  searchTerm = '';
  selectedStatus: 'available' | 'borrowed' | 'unavailable' = 'available';
  selectedCategoryId: number | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  // Modal
  isModalOpen = false;
  selectedBook: Book | undefined = undefined;

  // Toast
  toastMessage: { text: string; type: 'success' | 'error' } | null = null;

  ngOnInit() {
    this.loadBooks();
  }

  // ── Book Loading ──
  loadBooks() {
    this.isLoading = true;
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.allBooks = books;
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.showToast('Failed to load books.', 'error');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ── Filters ──
  filterByStatus(status: 'available' | 'borrowed' | 'unavailable') {
    this.selectedStatus = status;
    this.currentPage = 1;
    this.applyFilters();
  }

  onCategorySelected(categoryId: number | null) {
    this.selectedCategoryId = categoryId;
    this.currentPage = 1;
    this.applyFilters();
  }

  onCategoryAdded(category: Category) {
    this.showToast(`Category "${category.name}" added successfully.`, 'success');
  }

  onSearch() {
    this.currentPage = 1;
    this.applyFilters();
  }

  private applyFilters() {
    let filtered = this.allBooks;

    filtered = filtered.filter(book => {
      if (this.selectedStatus === 'available') return book.status === 'available';
      if (this.selectedStatus === 'borrowed') return book.status === 'borrowed';
      if (this.selectedStatus === 'unavailable') return book.status === 'unavailable' || book.status === 'maintenance';
      return true;
    });

    if (this.selectedCategoryId !== null) {
      filtered = filtered.filter(book => book.category_id === this.selectedCategoryId);
    }

    const term = this.searchTerm.toLowerCase().trim();
    if (term) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term)
      );
    }

    this.filteredBooks = filtered.map(book => ({
      ...book,
      availabilityPercent: book.total_copies ? (book.available_copies / book.total_copies) * 100 : 0
    }));

    this.totalPages = Math.max(1, Math.ceil(this.filteredBooks.length / this.pageSize));
    if (this.currentPage > this.totalPages) this.currentPage = 1;
    this.paginate();
  }

  // ── Pagination ──
  private paginate() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedBooks = this.filteredBooks.slice(start, start + this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.paginate();
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  // ── Book Operations ──
  getAvailabilityControl(book: Book): number {
    if (!book || !book.total_copies) return 0;
    return (book.available_copies / book.total_copies) * 100;
  }


  toggleStatus(book: Book) {
    const newStatus = book.status === 'available' ? 'maintenance' : 'available';
    this.bookService.updateBook(book.book_id!, { status: newStatus }).subscribe({
      next: () => {
        this.showToast(
          newStatus === 'available' ? 'Book marked as available.' : 'Book marked as unavailable.',
          'success'
        );
        this.loadBooks();
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

  // ── Modal ──
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
    if (!this.isModalOpen) this.selectedBook = undefined;
  }

  openEditModal(book: Book) {
    this.selectedBook = book;
    this.isModalOpen = true;
  }

  onBookSaved() {
    const wasEditing = !!this.selectedBook;
    this.isModalOpen = false;
    this.selectedBook = undefined;
    this.showToast(
      wasEditing ? 'Book updated successfully!' : 'Book added successfully!',
      'success'
    );
    this.loadBooks();
  }

  // ── Toast ──
  showToast(text: string, type: 'success' | 'error') {
    this.toastMessage = { text, type };
    setTimeout(() => this.toastMessage = null, 3000);
  }
}