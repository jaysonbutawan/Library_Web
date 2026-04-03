import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookModalService {
  private modalOpen$ = new BehaviorSubject<boolean>(false);
  private selectedBook$ = new BehaviorSubject<Book | undefined>(undefined);

  /**
   * Observable for modal open state
   */
  public isModalOpen$: Observable<boolean> = this.modalOpen$.asObservable();


  openNewBookModal(): void {
    this.selectedBook$.next(undefined);
    this.modalOpen$.next(true);
  }

  /**
   * Open modal to edit existing book
   */
  openEditBookModal(book: Book): void {
    this.selectedBook$.next(book);
    this.modalOpen$.next(true);
  }

  /**
   * Close modal
   */
  closeModal(): void {
    this.modalOpen$.next(false);
    // Keep selected book for now (will be cleared on open)
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
    return this.selectedBook$.value;
  }

  /**
   * Clear selected book
   */
  clearSelectedBook(): void {
    this.selectedBook$.next(undefined);
  }
}
