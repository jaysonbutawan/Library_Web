import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookModalService {
  private modalOpen$ = new BehaviorSubject<boolean>(false);
  // ✅ RENAME the private one:
  private selectedBookSubject$ = new BehaviorSubject<Book | undefined>(undefined);

  /**
   * Observable for modal open state
   */
  public isModalOpen$: Observable<boolean> = this.modalOpen$.asObservable();

  /**
   * Observable for selected book
   */
  public selectedBook$: Observable<Book | undefined> = this.selectedBookSubject$.asObservable();

  /**
   * Open modal for new book
   */
  openNewBookModal(): void {
    this.selectedBookSubject$.next(undefined);  // ✅ Update here
    this.modalOpen$.next(true);
  }

  /**
   * Open modal to edit existing book
   */
  openEditBookModal(book: Book): void {
    this.selectedBookSubject$.next(book);  // ✅ Update here
    this.modalOpen$.next(true);
  }

  /**
   * Close modal
   */
  closeModal(): void {
    this.modalOpen$.next(false);
  }

  /**
   * Check if modal is currently open
   */
  isOpen(): boolean {
    return this.modalOpen$.value;
  }

  /**
   * Get current selected book
   */
  getSelectedBook(): Book | undefined {
    return this.selectedBookSubject$.value;  // ✅ Update here
  }

  /**
   * Clear selected book
   */
  clearSelectedBook(): void {
    this.selectedBookSubject$.next(undefined);  // ✅ Update here
  }
}
