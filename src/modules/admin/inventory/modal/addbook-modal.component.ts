import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from "@angular/forms";
import { BookService } from './api.service';
import { Book } from './book.dto';

@Component({
  selector: "app-addbook-modal",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./addbook-modal.component.html",
})
export class AddbookModalComponent {
  private bookService = inject(BookService);
  
  @Output() close = new EventEmitter<void>();
  @Output() bookAdded = new EventEmitter<Book>();

  registerForm = new FormGroup({
    title: new FormControl('', Validators.required),
    author: new FormControl('', Validators.required),
    isbn: new FormControl('', Validators.required),
    category: new FormControl('Technology', Validators.required),
    publication_year: new FormControl(2026, [Validators.required, Validators.min(1000)]),
    total_copies: new FormControl(1, [Validators.required, Validators.min(1)])
  });

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      
      const newBook: Book = {
        title: formValue.title!,
        author: formValue.author!,
        isbn: formValue.isbn!,
        category: formValue.category!,
        publication_year: Number(formValue.publication_year),
        total_copies: Number(formValue.total_copies),
        available_copies: Number(formValue.total_copies), // Initially same as total
        status: 'AVAILABLE'
      };

      this.bookService.addBook(newBook).subscribe({
        next: (response) => {
          this.bookAdded.emit(response);
          this.onClose();
        },
        error: (err) => console.error('Failed to save book', err)
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}