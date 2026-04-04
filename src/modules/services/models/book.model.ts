export interface Book {
  book_id?: number;
  isbn: string;
  title: string;
  author: string;
  category_id?: number;
  category?: { category_id: number; name: string };
  status?: 'available' | 'borrowed' | 'unavailable' | 'maintenance';
  total_copies: number;
  available_copies?: number;
  publication_year: number;
}

export interface BookCreateRequest {
  title: string;
  author: string;
  isbn: string;
  category_id?: number;
  publication_year: number;
  total_copies: number;
}

export interface BookFilters {
  cursor?: string | null;
  search?: string;
  category?: string | null;
  status?: 'available' | 'borrowed' | 'unavailable' | 'maintenance' | 'all';
}

export interface BookResponse {
  data: Book[];
  path: string;
  per_page: number;
  next_cursor: string | null;
  next_page_url: string | null;
  prev_cursor: string | null;
  prev_page_url: string | null;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}
