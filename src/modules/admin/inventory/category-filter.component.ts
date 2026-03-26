import { Component, OnInit, inject, Output, EventEmitter, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from './category.service';

@Component({
    selector: 'app-category-filter',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="relative">
      <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
        Category
      </label>

      <div class="relative" #categoryContainer>
        <i class="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none"></i>
        <input
          type="text"
          [(ngModel)]="searchTerm"
          (ngModelChange)="onSearch()"
          (focus)="showDropdown = true"
          placeholder="Search or add category..."
          class="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
        />

        @if (showDropdown) {
          <div class="absolute z-50 mt-1 w-full bg-[#11141d] border border-white/10 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
            <button
              type="button"
              (click)="select(null, 'All')"
              class="w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors"
              [class]="selectedId === null ? 'text-indigo-400 font-bold' : 'text-slate-300'"
            >
              All Categories
            </button>

            <button
              *ngFor="let cat of filtered"
              type="button"
              (click)="select(cat.category_id, cat.name)"
              class="w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors"
              [class]="selectedId === cat.category_id ? 'text-indigo-400 font-bold' : 'text-slate-300'"
            >
              {{ cat.name }}
            </button>

            @if (filtered.length === 0 && searchTerm && searchTerm.trim()) {
              <div class="px-4 py-3 border-t border-white/5">
                <p class="text-slate-500 text-xs mb-2">No category found</p>
                <button
                  type="button"
                  (click)="addNew()"
                  [disabled]="isAdding"
                  class="w-full flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white rounded-lg text-sm font-bold transition-all active:scale-95"
                >
                  <i class="pi text-xs" [ngClass]="isAdding ? 'pi-spin pi-spinner' : 'pi-plus'"></i>
                  {{ isAdding ? 'Adding...' : 'Add "' + searchTerm.trim() + '"' }}
                </button>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
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

    ngOnInit() {
        this.loadCategories();
    }

    loadCategories() {
        this.categoryService.getCategories().subscribe({
            next: (categories) => {
                this.categories = categories;
                this.filtered = categories;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Failed to load categories:', err)
        });
    }

    onSearch() {
        if (!this.searchTerm) this.searchTerm = '';
        const term = this.searchTerm.toLowerCase().trim();
        this.showDropdown = true;

        this.filtered = term
            ? this.categories.filter(c => c.name.toLowerCase().includes(term))
            : this.categories;
    }

    select(id: number | null, name: string) {
        this.selectedId = id;
        this.searchTerm = id === null ? '' : name;
        this.showDropdown = false;
        this.categorySelected.emit(id);
    }

    addNew() {
        const name = (this.searchTerm || '').trim();
        if (!name) return;

        this.isAdding = true;

        this.categoryService.addCategory({ name }).subscribe({
            next: (response: any) => {
                const newCategory = response.data || response;
                this.categories.push(newCategory);
                this.select(newCategory.category_id, newCategory.name);
                this.isAdding = false;
                this.categoryAdded.emit(newCategory);
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.isAdding = false;
                this.error.emit(err.error?.message || 'Failed to add category.');
                this.cdr.detectChanges();
            }
        });
    }
}