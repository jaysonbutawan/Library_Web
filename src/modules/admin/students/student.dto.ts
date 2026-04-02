export interface StudentDto {
  id: number;
  full_name: string;
  student_id: string;
  department: string;
  total_borrowed: number;
  current_books: number;
  fines: number;
}

export interface StudentResponse {
  data: StudentDto[];
  meta: {
    next_cursor: string | null;
    prev_cursor: string | null;
    per_page: number;
  };
}
