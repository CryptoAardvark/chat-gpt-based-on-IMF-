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

//Date param interface
export interface DateParams {
  imf_years: string[];
  topics: string;
  countries: string[];
  simpleAnswer: string;
}

//API response interface
export interface APIResponse<T> {
  data: {
    imf: T;
    topics: string;
  };
  error?: string;
}