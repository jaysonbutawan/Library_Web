import { Component, OnInit, inject, ChangeDetectorRef, HostListener } from "@angular/core";
import { CommonModule, NgClass } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Book } from "./book.dto";
import { AddbookModalComponent } from "./modal/addbook-modal.component";
import { BookService } from "./book.service";
import { CategoryService, Category } from "./category.service";

@Component({
  selector: "app-inventory",
  standalone: true,
  imports: [CommonModule, NgClass, FormsModule, AddbookModalComponent],
  templateUrl: "./inventory.component.html",
})
export class InventoryComponent implements OnInit {
  private bookService = inject(BookService);
  private categoryService = inject(CategoryService);
  private cdr = inject(ChangeDetectorRef);

  // Existing properties
  searchTerm: string = '';
  allBooks: Book[] = [];
  filteredBooks: Book[] = [];
  isLoading = true;
  selectedStatus: 'available' | 'borrowed' | 'unavailable' = 'available';
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  paginatedBooks: Book[] = [];

  // Category properties
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  categorySearch = '';
  selectedCategoryId: number | null = null;
  showCategoryDropdown = false;
  isAddingCategory = false;

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.col-span-3')) {
      this.showCategoryDropdown = false;
    }
  }

  ngOnInit() {
    this.loadCategories();
    this.loadBooks();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.filteredCategories = categories;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load categories:', err)
    });
  }

  onCategorySearch() {
     if (!this.categorySearch) {
    this.categorySearch = '';
  }
    const term = this.categorySearch.toLowerCase().trim();
    this.showCategoryDropdown = true;

    if (!term) {
      this.filteredCategories = this.categories;
    } else {
      this.filteredCategories = this.categories.filter(cat =>
        cat.name.toLowerCase().includes(term)
      );
    }
  }

  selectCategory(id: number | null, name: string) {
    this.selectedCategoryId = id;
    this.categorySearch = id === null ? '' : name;
    this.showCategoryDropdown = false;
    this.applyFilters();
  }

addNewCategory() {
  const name = (this.categorySearch || '').trim();
  if (!name) return;

  this.isAddingCategory = true;

  this.categoryService.addCategory({ name }).subscribe({
    next: (response: any) => {
      // Handle both wrapped and unwrapped responses
      const newCategory = response.data || response;

      this.categories.push(newCategory);
      this.selectCategory(newCategory.category_id, newCategory.name);
      this.isAddingCategory = false;
      this.showToast(`Category "${name}" added successfully.`, 'success');
      this.cdr.detectChanges();
    },
    error: (err) => {
      this.isAddingCategory = false;
      this.showToast(err.error?.message || 'Failed to add category.', 'error');
      this.cdr.detectChanges();
    }
  });
}
  loadBooks() {
    this.isLoading = true;
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.allBooks = books;
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading books:', err);
        this.showToast('Failed to load books.', 'error');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterByStatus(status: 'available' | 'borrowed' | 'unavailable') {
    this.selectedStatus = status;
    this.applyFilters();
  }
 private applyFilters() {
    let filtered = this.allBooks;

    // Filter by status
    filtered = filtered.filter(book => {
      if (this.selectedStatus === 'available') return book.status === 'available';
      else if (this.selectedStatus === 'borrowed') return book.status === 'borrowed';
      else if (this.selectedStatus === 'unavailable') return book.status === 'unavailable' || book.status === 'maintenance';
      return true;
    });

    // Filter by category
    if (this.selectedCategoryId !== null) {
      filtered = filtered.filter(book => book.category_id === this.selectedCategoryId);
    }

    // Filter by search term
    const term = this.searchTerm.toLowerCase().trim();
    if (term) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term)
      );
    }

    this.filteredBooks = filtered.map(book => ({
      ...book,
      availabilityPercent: book.total_copies ? (book.available_copies / book.total_copies) * 100 : 0
    }));

    this.totalPages = Math.max(1, Math.ceil(this.filteredBooks.length / this.pageSize));
    if (this.currentPage > this.totalPages) this.currentPage = 1;
    this.paginate();
  }

  private paginate() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedBooks = this.filteredBooks.slice(start, start + this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.paginate();
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  onSearch() {
    this.applyFilters();
  }

  get totalRecords(): string {
    return this.filteredBooks.length.toLocaleString();
  }

  getAvailabilityControl(book: Book): number {
    if (!book || !book.total_copies) return 0;
    return (book.available_copies / book.total_copies) * 100;
  }

  isModalOpen = false;
  selectedBook: Book | undefined = undefined;

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
    if (!this.isModalOpen) this.selectedBook = undefined;
  }

  openEditModal(book: Book) {
    this.selectedBook = book;
    this.isModalOpen = true;
  }

  toastMessage: { text: string; type: 'success' | 'error' } | null = null;

  showToast(text: string, type: 'success' | 'error') {
    this.toastMessage = { text, type };
    setTimeout(() => this.toastMessage = null, 3000);
  }

  onBookSaved(book: Book) {
    const wasEditing = !!this.selectedBook;
    this.isModalOpen = false;
    this.selectedBook = undefined;
    this.showToast(
      wasEditing ? 'Book updated successfully!' : 'Book added successfully!',
      'success'
    );
    this.loadBooks();
  }

  toggleStatus(book: Book) {
    const newStatus = book.status === 'available' ? 'maintenance' : 'available';
    this.bookService.updateBook(book.book_id!, { status: newStatus }).subscribe({
      next: () => {
        this.showToast(
          newStatus === 'available' ? 'Book marked as available.' : 'Book marked as unavailable.',
          'success'
        );
        this.loadBooks(); // reload instead of mutating in place
      },
      error: () => this.showToast('Failed to update status.', 'error')
    });
  }

  deleteBook(book: Book) {
    if (!confirm(`Delete "${book.title}"? This cannot be undone.`)) return;
    this.bookService.deleteBook(book.book_id!).subscribe({
      next: () => {
        this.showToast('Book deleted successfully.', 'success');
        this.loadBooks();
      },
      error: () => this.showToast('Failed to delete book.', 'error')
    });
  }
}