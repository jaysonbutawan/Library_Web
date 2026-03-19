export interface BookAsset {
  id: string;
  title: string;
  classification: string;
  isbn: string;
  status: 'AVAILABLE' | 'RESERVED' | 'OFFLINE';
  isActive: boolean;
  coverColor: string; 
}

