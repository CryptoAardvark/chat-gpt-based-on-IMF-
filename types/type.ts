//API response interface
export interface ApiResponse<T> {
  data: T;
  error?: string;
}