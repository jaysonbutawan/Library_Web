export interface BookAsset {
  id: string;
  title: string;
  category: string;
  author: string;
  isbn: string;
  total_copies?: number;
  available_copies: number;
  status: 'AVAILABLE' | 'RESERVED' | 'OFFLINE';
  isActive: boolean;
  coverColor: string; 
}

