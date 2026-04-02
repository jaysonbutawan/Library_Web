export interface BookDto {
  book_id: number;
  title: string;
  author: string;
}

export interface BorrowRequestDto {
  request_id: number;
  user_id: number;
  full_name: string;
  book: BookDto | null;
  status: string;
  queue_position: number;
  requested_at: string;
  approved_at: string | null;
  expires_at: string | null;
  days_remaining: number | null;
  is_expired: boolean;
}

export interface BorrowRequestResponseDto {
  message: string;
  data: BorrowRequestDto[];
  count: number;
}
