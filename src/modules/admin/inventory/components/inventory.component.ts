import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Book, BookFilters } from '../../../services/models/book.model';
import { Category } from '../../../services/models/category.model';
import { BookService } from '../../../services/book.service';
import { BookModalService } from '../services/addbook-modal.service';
import { AddbookModalComponent } from '../components/addbook-modal.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, AddbookModalComponent],
  templateUrl: '../pages/inventory.component.html',
})
export class InventoryComponent implements OnInit, OnDestroy {
  private bookService = inject(BookService);
  private modalService = inject(BookModalService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  // Data
  books: Book[] = [];
  isLoading = true;
  toastMessage: { text: string; type: 'success' | 'error' } | null = null;

  // Modal state - Observable streams from service
  isModalOpen$ = this.modalService.isModalOpen$;
  selectedBook$ = this.modalService.selectedBook$;
  searchQuery: string = '';
  // Filters
  filters: BookFilters = {
    search: '',
    status: 'available',
    category: null,
  };

  // Pagination
  nextCursor: string | null = null;
  prevCursor: string | null = null;

  ngOnInit(): void {
    this.loadBooks();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load books from API with current filters
   */
  loadBooks(cursor: string | null = null): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.bookService.getBooks({ ...this.filters, cursor })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('API Response:', response);

          // Handle response - works with both structured and simple array responses
          if (Array.isArray(response)) {
            this.books = response;
            this.nextCursor = null;
            this.prevCursor = null;
          } else {
            // Assume it's an object with data property
            this.books = response.data || [];
            this.nextCursor = response.next_cursor || null;
            this.prevCursor = response.prev_cursor || null;
          }

          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error loading books:', err);
          this.showToast('Failed to load books.', 'error');
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  /**
   * Handle search
   */
  onSearch(): void {
    this.filters = { ...this.filters, search: this.filters.search?.trim() || '' };
    this.cdr.markForCheck();
    this.loadBooks();
  }
  onSearchChange(query: string): void {
    this.filters = { ...this.filters, search: query };
    this.cdr.markForCheck();
  }

  /**
   * Clear search
   */
  clearSearch(): void {
    this.filters = { ...this.filters, search: '' };
    this.cdr.markForCheck();
    this.loadBooks();
  }
  /**
   * Filter books by status
   */
  filterByStatus(status: BookFilters['status']): void {
    this.filters = { ...this.filters, status };
    this.cdr.markForCheck();
    this.loadBooks();
  }

  /**
   * Handle category selection
   */
  // onCategorySelected(category: number | null): void {
  //   this.filters = { ...this.filters, category };
  //   this.cdr.markForCheck();
  //   this.loadBooks();
  // }

  /**
   * Handle new category added
   */
  onCategoryAdded(category: Category): void {
    this.showToast(`Category "${category.name}" added successfully.`, 'success');
    this.cdr.markForCheck();
  }

  /**
   * Pagination - next page
   */
  nextPage(): void {
    if (this.nextCursor) this.loadBooks(this.nextCursor);
  }

  /**
   * Pagination - previous page
   */
  prevPage(): void {
    if (this.prevCursor) this.loadBooks(this.prevCursor);
  }

  /**
   * Calculate availability percentage for progress bar
   */
  availabilityPercent(book: Book): number {
    if (!book.total_copies) return 0;
    return ((book.available_copies ?? 0) / book.total_copies) * 100;
  }

  /**
   * Toggle book availability status
   */
  toggleStatus(book: Book): void {
    const newStatus = book.status === 'available' ? 'unavailable' : 'available';

    if (!book.book_id) {
      this.showToast('Invalid book ID.', 'error');
      return;
    }
    if (!book.book_id) return;

    this.bookService.updateBook(book.book_id!, { status: newStatus })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('API Response:', response);

          this.showToast(
            response?.status || (
              newStatus === 'available'
                ? 'Book marked as available.'
                : 'Book marked as unavailable.'
            ),
            'success'
          );

          this.loadBooks();
        },
        error: (err) => {
          console.error(err);
          this.showToast(err?.error?.message || 'Failed to update status.', 'error');
        },
      });
  }

  /**
   * Delete book with confirmation
   */
  deleteBook(book: Book): void {
    if (!confirm(`Delete "${book.title}"? This cannot be undone.`)) return;

    this.bookService.deleteBook(book.book_id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showToast('Book deleted successfully.', 'success');
          this.loadBooks();
        },
        error: () => this.showToast('Failed to delete book.', 'error'),
      });
  }

  /**
   * Open modal for adding new book
   */
  openAddBookModal(): void {
    this.modalService.openNewBookModal();
  }

  /**
   * Open modal for editing book
   */
  openEditModal(book: Book): void {
    this.modalService.openEditBookModal(book);
  }

  /**
   * Handle book save from modal
   */
  onBookSaved(): void {
    const wasEditing = !!this.modalService.getSelectedBook();
    this.modalService.closeModal();
    this.showToast(
      wasEditing ? 'Book updated successfully!' : 'Book added successfully!',
      'success'
    );
    this.loadBooks();
  }

  /**
   * Handle modal close
   */
  onModalClose(): void {
    this.modalService.closeModal();
  }

  /**
   * Show toast notification
   */
  private showToast(text: string, type: 'success' | 'error'): void {
    this.toastMessage = { text, type };
    this.cdr.markForCheck();
    setTimeout(() => {
      this.toastMessage = null;
      this.cdr.markForCheck();
    }, 3000);
  }
}
