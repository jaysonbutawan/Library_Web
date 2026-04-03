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
  category?: number | null;
  status?: 'available' | 'borrowed' | 'unavailable' | 'maintenance' | 'all';
}

export interface BookResponse {
  data: Book[];
  meta: {
    next_cursor: string | null;
    prev_cursor: string | null;
    per_page: number;
  };
}
