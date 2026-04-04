import { Component, OnInit, inject, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book, BookFilters, BookResponse } from '../../services/models/book.model';
import { BookService } from '../../services/book.service';
import { CategoryService, Category } from '../../services/category.service';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './catalog.component.html',
})
export class CatalogComponent implements OnInit, OnDestroy {
  private bookService = inject(BookService);
  private categoryService = inject(CategoryService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();
  private searchInput$ = new Subject<string>();

  filters: BookFilters = { search: '', category: null, status: 'all' };

  categories: Category[] = [];
  activeCategory: Category | null = null;

  books: Book[] = [];
  isLoading = false;
  errorMessage = '';

  nextCursor: string | null = null;
  prevCursor: string | null = null;

  ngOnInit(): void {
    // Debounce: wait 400ms after user stops typing, then search
    this.searchInput$
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((query) => {
        console.log('[CatalogComponent] debounced search fired:', query);
        this.filters = { ...this.filters, search: query };
        this.nextCursor = null;
        this.prevCursor = null;
        this.loadBooks();
      });

    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategories(): void {
    console.log('[CatalogComponent] loadCategories() called');
    this.categoryService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          console.log('[CatalogComponent] categories loaded:', categories);
          this.categories = [{ category_id: 0, name: 'ALL BOOKS' }, ...categories];
          this.activeCategory = this.categories[0];
          this.loadBooks();
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('[CatalogComponent] failed to load categories:', err);
          this.errorMessage = 'Failed to load categories.';
          this.cdr.markForCheck();
        },
      });
  }

  loadBooks(cursor: string | null = null): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    const filters: BookFilters = {
      cursor,
      search: this.filters.search || undefined,
      category: this.activeCategory?.category_id === 0 ? null : (this.activeCategory?.name ?? null),
      status: 'all',
    };

    console.log('[CatalogComponent] loadBooks() with filters:', filters);

    this.bookService.getBooks(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: BookResponse) => {
          console.log('[CatalogComponent] books response:', response);
          this.books = response.data;
          this.nextCursor = response.next_cursor;
          this.prevCursor = response.prev_cursor;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('[CatalogComponent] failed to load books:', err);
          this.errorMessage = 'Failed to load books. Please try again.';
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  // Called on (keyup.enter) — immediate search
  onSearch(): void {
    const query = this.filters.search?.trim() ?? '';
    console.log('[CatalogComponent] onSearch():', query);
    this.filters = { ...this.filters, search: query };
    this.nextCursor = null;
    this.prevCursor = null;
    this.loadBooks();
  }

  // Called on (input) — feeds the debounce stream
  onSearchChange(query: string): void {
    this.searchInput$.next(query);
  }

  // Called when the X button is clicked
  clearSearch(): void {
    console.log('[CatalogComponent] clearSearch()');
    this.filters = { ...this.filters, search: '' };
    this.nextCursor = null;
    this.prevCursor = null;
    this.loadBooks();
  }

  setCategory(category: Category): void {
    if (this.activeCategory?.category_id === category.category_id) return;
    this.activeCategory = category;
    this.nextCursor = null;
    this.prevCursor = null;
    console.log('[CatalogComponent] setCategory():', category);
    this.loadBooks();
  }

  nextPage(): void {
    if (this.nextCursor) this.loadBooks(this.nextCursor);
  }

  prevPage(): void {
    if (this.prevCursor) this.loadBooks(this.prevCursor);
  }

  getStatus(book: Book): string {
    if (book.status) return book.status.toUpperCase();
    return (book.available_copies ?? 0) > 0 ? 'AVAILABLE' : 'UNAVAILABLE';
  }

  isAvailable(book: Book): boolean {
    return book.status === 'available' || (book.available_copies ?? 0) > 0;
  }
}
