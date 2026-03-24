export interface Book {
  book_id?: number; 
  isbn: string;
  title: string;
  author: string;
  category: string;
  status: 'available' | 'borrowed' | 'maintenance';
  total_copies: number;
  available_copies: number;
  publication_year: number;
}