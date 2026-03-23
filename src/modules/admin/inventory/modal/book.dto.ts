export interface Book {
  book_id?: number; // Optional because new books don't have an ID yet
  isbn: string;
  title: string;
  author: string;
  category: string;
  status: 'AVAILABLE' | 'BORROWED' | 'MAINTENANCE';
  total_copies: number;
  available_copies: number;
  publication_year: number;
}