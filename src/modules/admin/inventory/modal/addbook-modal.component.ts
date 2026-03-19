import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule,FormGroup,FormControl, Validators} from "@angular/forms";
import { BookAsset } from "../inventory.component.dto";

@Component({
  selector: "app-addbook-modal",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "../modal/addbook-modal.component.html",
})
export class AddbookModalComponent {
@Output() close = new EventEmitter<void>();
@Output() save = new EventEmitter<BookAsset>();

  registerForm = new FormGroup({
    title: new FormControl('', Validators.required),
    author: new FormControl('', Validators.required),
    isbn: new FormControl('', Validators.required),
    category: new FormControl('Philosophy'),
    year: new FormControl('2026')
  });

  onClose() {
    this.close.emit();
  }
  onSubmit() {
    if (this.registerForm.valid) {
      const newBook: BookAsset = {
        id: Math.random().toString(36).substring(2, 9), 
        title: this.registerForm.value.title ?? '',
        author: this.registerForm.value.author ?? '',
        isbn: this.registerForm.value.isbn ?? '',
        category: this.registerForm.value.category ?? 'General',
        status: 'AVAILABLE', 
        isActive: true,
        available_copies: 1,
        total_copies: 1,
        coverColor: 'bg-indigo-100'
      };

      this.save.emit(newBook); 
      this.onClose(); 
    } else {
      this.registerForm.markAllAsTouched(); 
    }
  }

}