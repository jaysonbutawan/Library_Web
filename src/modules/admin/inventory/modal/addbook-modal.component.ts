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
      this.registerForm.patchValue({
        title: this.editBookData.title,
        author: this.editBookData.author,
        isbn: this.editBookData.isbn,
        category: this.editBookData.category,
        publication_year: this.editBookData.publication_year,
        total_copies: this.editBookData.total_copies
      });
    }
  }

  onClose() { this.close.emit(); }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const formValue = this.registerForm.value;
    const payload: Book = {
      title: formValue.title!,
      author: formValue.author!,
      isbn: formValue.isbn!,
      category: formValue.category!,
      publication_year: Number(formValue.publication_year),
      total_copies: Number(formValue.total_copies),
      available_copies: this.editBookData ? this.editBookData.available_copies : Number(formValue.total_copies),
      status: this.editBookData ? this.editBookData.status : 'available'
    };

    const request = this.editBookData?.book_id
      ? this.api.updateBook(this.editBookData.book_id, payload)
      : this.api.addBook(payload);

    request.subscribe({
      next: (res) => {
        this.bookSaved.emit(res);
        this.onClose();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || "Failed to save record.";
      }
    });
  }
}