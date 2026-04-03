import {
  Component,
  OnInit,
  inject,
  Output,
  EventEmitter,
  HostListener,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-filter.component.html',
})
export class CategoryFilterComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private cdr = inject(ChangeDetectorRef);

  @Output() categorySelected = new EventEmitter<number | null>();
  @Output() categoryAdded = new EventEmitter<Category>();
  @Output() error = new EventEmitter<string>();

  categories: Category[] = [];
  filtered: Category[] = [];
  searchTerm = '';
  selectedId: number | null = null;
  showDropdown = false;
  isAdding = false;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('app-category-filter')) {
      this.showDropdown = false;
    }
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.filtered = categories;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error.emit(err?.error?.message || 'Failed to load categories.');
        this.cdr.markForCheck();
      },
    });
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.showDropdown = true;
    this.filtered = term
      ? this.categories.filter((c) => c.name.toLowerCase().includes(term))
      : this.categories;
  }

  select(id: number | null, name: string): void {
    this.selectedId = id;
    this.searchTerm = id === null ? '' : name;
    this.showDropdown = false;
    this.categorySelected.emit(id);
  }

  addNew(): void {
    const name = this.searchTerm.trim();
    if (!name) return;

    this.isAdding = true;

    this.categoryService.addCategory({ name }).subscribe({
      next: (response: any) => {
        const newCategory: Category = response.data ?? response;
        this.categories = [...this.categories, newCategory];
        this.select(newCategory.category_id, newCategory.name);
        this.isAdding = false;
        this.categoryAdded.emit(newCategory);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isAdding = false;
        this.error.emit(err.error?.message || 'Failed to add category.');
        this.cdr.markForCheck();
      },
    });
  }
}
