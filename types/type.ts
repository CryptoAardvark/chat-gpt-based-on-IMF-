//API response interface
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

//IMF interface
export interface IMFParams {
  indicators: string[];
  countries: string[];
  years: string[];
}