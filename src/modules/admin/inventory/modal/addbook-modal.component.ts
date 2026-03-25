import { Component, Output, EventEmitter, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from "@angular/forms";
import { BookService } from '../api.service';
import { Book } from '../book.dto';

@Component({
  selector: "app-addbook-modal",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./addbook-modal.component.html",
})
export class AddbookModalComponent implements OnInit {
  private api = inject(BookService);

  @Input() editBookData?: Book;
  @Output() close = new EventEmitter<void>();
  @Output() bookSaved = new EventEmitter<Book>();

  isLoading = false;
  errorMessage: string | null = null;
  hasChanges = false;
  private originalValues: Partial<Book> = {};

  registerForm = new FormGroup({
    title: new FormControl('', Validators.required),
    author: new FormControl('', Validators.required),
    isbn: new FormControl('', Validators.required),
    category: new FormControl('Technology', Validators.required),
    publication_year: new FormControl(new Date().getFullYear(), [Validators.required]),
    total_copies: new FormControl(1, [Validators.required, Validators.min(1)])
  });

  ngOnInit() {
    if (this.editBookData) {
      // Store original values
      this.originalValues = {
        title: this.editBookData.title,
        author: this.editBookData.author,
        isbn: this.editBookData.isbn,
        category: this.editBookData.category,
        publication_year: this.editBookData.publication_year,
        total_copies: this.editBookData.total_copies
      };

      // Populate form with original values
      this.registerForm.patchValue({
        title: this.editBookData.title,
        author: this.editBookData.author,
        isbn: this.editBookData.isbn,
        category: this.editBookData.category,
        publication_year: this.editBookData.publication_year,
        total_copies: this.editBookData.total_copies
      });

      this.registerForm.markAsPristine();
    }

    // Listen to form value changes
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
      formValue.category !== this.originalValues.category ||
      Number(formValue.publication_year) !== this.originalValues.publication_year ||
      Number(formValue.total_copies) !== this.originalValues.total_copies;
  }

  private getChangedFields(): Partial<Book> {
    if (!this.editBookData) {
      // For new books, return all fields
      const formValue = this.registerForm.value;
      return {
        title: formValue.title!,
        author: formValue.author!,
        isbn: formValue.isbn!,
        category: formValue.category!,
        publication_year: Number(formValue.publication_year),
        total_copies: Number(formValue.total_copies),
      };
    }

    // For editing, return only changed fields
    const changedFields: Partial<Book> = {};
    const formValue = this.registerForm.value;

    if (formValue.title !== this.originalValues.title) {
      changedFields.title = formValue.title!;
    }
    if (formValue.author !== this.originalValues.author) {
      changedFields.author = formValue.author!;
    }
    if (formValue.isbn !== this.originalValues.isbn) {
      changedFields.isbn = formValue.isbn!;
    }
    if (formValue.category !== this.originalValues.category) {
      changedFields.category = formValue.category!;
    }
    if (Number(formValue.publication_year) !== this.originalValues.publication_year) {
      changedFields.publication_year = Number(formValue.publication_year);
    }
    if (Number(formValue.total_copies) !== this.originalValues.total_copies) {
      changedFields.total_copies = Number(formValue.total_copies);
    }

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

    // Get only changed fields for updates, all fields for new books
    const payload = this.getChangedFields();

    console.log('📤 Sending payload:', payload); // Debug log

    const request = this.editBookData?.book_id
      ? this.api.updateBook(this.editBookData.book_id, payload)
      : this.api.addBook(payload as Book);

    request.subscribe({
      next: (res) => {
        console.log('✅ Book saved successfully:', res);
        this.isLoading = false;
        if (!this.editBookData) {
          this.registerForm.reset({
            category: 'Technology',
            publication_year: new Date().getFullYear(),
            total_copies: 1
          });
        }
        this.bookSaved.emit(res);
        this.onClose();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('❌ Error saving book:', err);
        this.errorMessage = err.error?.message || err.error?.errors?.[Object.keys(err.error.errors)[0]]?.[0] || "Failed to save record.";
      }
    });
  }
}