import { Component, Output, EventEmitter, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from "@angular/forms";
import { BookService } from '../book.service';
import { Book } from '../book.dto';
import { CategoryService, Category } from '../category.service';

@Component({
  selector: "app-addbook-modal",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./addbook-modal.component.html",
})
export class AddbookModalComponent implements OnInit {
  private api = inject(BookService);
  private categoryService = inject(CategoryService);

  @Input() editBookData?: Book;
  @Output() close = new EventEmitter<void>();
  @Output() bookSaved = new EventEmitter<Book>();

  categories: Category[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  hasChanges = false;
  private originalValues: Partial<Book> = {};

  registerForm = new FormGroup({
    title: new FormControl('', Validators.required),
    author: new FormControl('', Validators.required),
    isbn: new FormControl('', Validators.required),
    category_id: new FormControl<number | null>(null, Validators.required),
    publication_year: new FormControl(new Date().getFullYear(), [Validators.required]),
    total_copies: new FormControl(1, [Validators.required, Validators.min(1)])
  });

  ngOnInit() {
    // Load categories from API
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;

        // If editing and no category_id is set yet, patch after categories load
        if (this.editBookData?.category_id) {
          this.registerForm.patchValue({ category_id: this.editBookData.category_id });
        }
      },
      error: (err) => console.error('Failed to load categories:', err)
    });

    if (this.editBookData) {
      this.originalValues = {
        title: this.editBookData.title,
        author: this.editBookData.author,
        isbn: this.editBookData.isbn,
        category_id: this.editBookData.category_id,
        publication_year: this.editBookData.publication_year,
        total_copies: this.editBookData.total_copies
      };

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

    this.registerForm.valueChanges.subscribe(() => {
      this.detectChanges();
    });
  }

  private detectChanges(): void {
    if (!this.editBookData) {
      this.hasChanges = this.registerForm.valid;
      return;
    }

    const formValue = this.registerForm.value;

    this.hasChanges =
      formValue.title !== this.originalValues.title ||
      formValue.author !== this.originalValues.author ||
      formValue.isbn !== this.originalValues.isbn ||
      Number(formValue.category_id) !== this.originalValues.category_id ||
      Number(formValue.publication_year) !== this.originalValues.publication_year ||
      Number(formValue.total_copies) !== this.originalValues.total_copies;
  }

  private getChangedFields(): Partial<Book> {
    const formValue = this.registerForm.value;

    if (!this.editBookData) {
      return {
        title: formValue.title!,
        author: formValue.author!,
        isbn: formValue.isbn!,
        category_id: Number(formValue.category_id),
        publication_year: Number(formValue.publication_year),
        total_copies: Number(formValue.total_copies),
      };
    }

    const changedFields: Partial<Book> = {};

    if (formValue.title !== this.originalValues.title) changedFields.title = formValue.title!;
    if (formValue.author !== this.originalValues.author) changedFields.author = formValue.author!;
    if (formValue.isbn !== this.originalValues.isbn) changedFields.isbn = formValue.isbn!;
    if (Number(formValue.category_id) !== this.originalValues.category_id) changedFields.category_id = Number(formValue.category_id);
    if (Number(formValue.publication_year) !== this.originalValues.publication_year) changedFields.publication_year = Number(formValue.publication_year);
    if (Number(formValue.total_copies) !== this.originalValues.total_copies) changedFields.total_copies = Number(formValue.total_copies);

    return changedFields;
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    if (this.editBookData && !this.hasChanges) {
      this.errorMessage = "No changes detected. Please modify at least one field.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const payload = this.getChangedFields();

    const request = this.editBookData?.book_id
      ? this.api.updateBook(this.editBookData.book_id, payload)
      : this.api.addBook(payload as Book);

    request.subscribe({
      next: (res) => {
        this.isLoading = false;
        if (!this.editBookData) {
          this.registerForm.reset({
            category_id: null,
            publication_year: new Date().getFullYear(),
            total_copies: 1
          });
        }
        this.bookSaved.emit(res);
        this.onClose();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || err.error?.errors?.[Object.keys(err.error.errors)[0]]?.[0] || "Failed to save record.";
      }
    });
  }
}