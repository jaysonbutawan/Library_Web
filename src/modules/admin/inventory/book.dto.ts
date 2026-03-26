export interface Book {
  book_id?: number;
  isbn: string;
  title: string;
  author: string;
  category_id: number | null;    // changed from category: string
  category?: { category_id: number; name: string };
  status: 'available' | 'borrowed' | 'unavailable' | 'maintenance';
  total_copies: number;
  available_copies: number;
  publication_year: number;
}