import {
  Component, Output, EventEmitter, inject, Input, OnInit, OnDestroy, ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from "@angular/forms";
import { BookService } from '../services/book.service';
import { Book, BookCreateRequest } from '../models/book.model';
import { CategoryService, Category } from '../services/category.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: "app-addbook-modal",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "../pages/addbook-modal.component.html",
})
export class AddbookModalComponent implements OnInit, OnDestroy {
  private api = inject(BookService);
  private categoryService = inject(CategoryService);
  private destroy$ = new Subject<void>();
  private cdr = inject(ChangeDetectorRef);

  @Input() editBookData?: Book;
  @Output() close = new EventEmitter<void>();
  @Output() bookSaved = new EventEmitter<Book>();

  categories: Category[] = [];
  isLoading = false;
  isSaving = false;
  errorMessage: string | null = null;
  hasChanges = false;

  private originalValues: Partial<Book> = {};

  registerForm = new FormGroup({
    title: new FormControl('', Validators.required),
    author: new FormControl('', Validators.required),
    isbn: new FormControl('', Validators.required),
    category_id: new FormControl<number | null>(null),
    publication_year: new FormControl(new Date().getFullYear(), Validators.required),
    total_copies: new FormControl(1, [Validators.required, Validators.min(1)])
  });

  ngOnInit() {
    this.loadCategories();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load categories from API
   */
  private loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          console.log('[CategoryService] raw response:', categories);
          this.categories = categories;
          console.log('[AddbookModal] this.categories set to:', this.categories);
          this.isLoading = false;
          this.setupForm();
          this.watchFormChanges();

          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('[AddbookModal] Failed to load categories:', err);
          this.isLoading = false;
          this.errorMessage = 'Failed to load categories';
        }
      });
  }

  /**
   * Setup form with edit data if provided
   */
  private setupForm(): void {
    if (!this.editBookData) {
      return;
    }

    // Store original values for change detection
    this.originalValues = {
      title: this.editBookData.title,
      author: this.editBookData.author,
      isbn: this.editBookData.isbn,
      category_id: this.editBookData.category_id,
      publication_year: this.editBookData.publication_year,
      total_copies: this.editBookData.total_copies
    };

    // Populate form with edit data
    this.registerForm.patchValue({
      title: this.editBookData.title,
      author: this.editBookData.author,
      isbn: this.editBookData.isbn,
      category_id: this.editBookData.category_id,
      publication_year: this.editBookData.publication_year,
      total_copies: this.editBookData.total_copies
    });

    this.registerForm.markAsPristine();
  }

  /**
   * Watch for form value changes and detect if anything changed
   */
  private watchFormChanges(): void {
    this.registerForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.detectChanges();
      });
  }

  /**
   * Detect if form values changed from original
   */
  private detectChanges(): void {
    // For new books, mark as changed if form is valid
    if (!this.editBookData) {
      this.hasChanges = this.registerForm.valid;
      return;
    }

    // For edit, compare with original values
    const formValue = this.registerForm.value;
    this.hasChanges =
      formValue.title !== this.originalValues.title ||
      formValue.author !== this.originalValues.author ||
      formValue.isbn !== this.originalValues.isbn ||
      Number(formValue.category_id) !== this.originalValues.category_id ||
      Number(formValue.publication_year) !== this.originalValues.publication_year ||
      Number(formValue.total_copies) !== this.originalValues.total_copies;
  }

  /**
   * Get payload for creating a new book
   */
  private getCreatePayload(): BookCreateRequest {
    const formValue = this.registerForm.value;

    return {
      title: formValue.title!,
      author: formValue.author!,
      isbn: formValue.isbn!,
      publication_year: Number(formValue.publication_year),
      total_copies: Number(formValue.total_copies),
      category_id: formValue.category_id ? Number(formValue.category_id) : undefined,
    };
  }

  /**
   * Get payload for updating a book (only changed fields)
   */
  private getUpdatePayload(): Partial<BookCreateRequest> {
    const formValue = this.registerForm.value;
    const changedFields: Partial<BookCreateRequest> = {};

    // Only include fields that actually changed
    if (formValue.title !== this.originalValues.title) {
      changedFields.title = formValue.title!;
    }
    if (formValue.author !== this.originalValues.author) {
      changedFields.author = formValue.author!;
    }
    if (formValue.isbn !== this.originalValues.isbn) {
      changedFields.isbn = formValue.isbn!;
    }
    if (Number(formValue.category_id) !== this.originalValues.category_id) {
      changedFields.category_id = formValue.category_id ? Number(formValue.category_id) : undefined;
    }
    if (Number(formValue.publication_year) !== this.originalValues.publication_year) {
      changedFields.publication_year = Number(formValue.publication_year);
    }
    if (Number(formValue.total_copies) !== this.originalValues.total_copies) {
      changedFields.total_copies = Number(formValue.total_copies);
    }

    return changedFields;
  }

  /**
   * Close modal
   */
  onClose(): void {
    this.close.emit();
  }

  /**
   * Submit form - either create or update book
   */
  onSubmit(): void {
    // Validate form
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage = 'Please fill in all required fields correctly';
      return;
    }

    // Check if editing and no changes
    if (this.editBookData && !this.hasChanges) {
      this.errorMessage = "No changes detected. Please modify at least one field.";
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;

    // Get appropriate payload based on create vs update
    const payload = this.editBookData?.book_id
      ? this.getUpdatePayload()
      : this.getCreatePayload();

    // Decide between create or update
    const request = this.editBookData?.book_id
      ? this.api.updateBook(this.editBookData.book_id, payload)
      : this.api.addBook(payload as BookCreateRequest);

    request
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isSaving = false;
          this.resetForm();
          this.bookSaved.emit(res);
          this.onClose();
        },
        error: (err) => {
          this.isSaving = false;
          this.handleError(err);
        }
      });
  }

  /**
   * Reset form to initial state
   */
  private resetForm(): void {
    if (!this.editBookData) {
      this.registerForm.reset({
        category_id: null,
        publication_year: new Date().getFullYear(),
        total_copies: 1
      });
    }
  }

  /**
   * Handle API errors
   */
  private handleError(err: any): void {
    // Try to get error message from different sources
    const errorMessage =
      err.error?.message ||
      err.error?.errors?.[Object.keys(err.error.errors)[0]]?.[0] ||
      'Failed to save book. Please try again.';

    this.errorMessage = errorMessage;
  }
}
