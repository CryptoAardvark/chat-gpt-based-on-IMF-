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

//Pinecone interface
export interface PineconeParams {
  imf_indicators: string[];
}

//Result interface
export interface ResultParams {
  chart_source: ResultSource[] | string;
  recommend_chart_type: string;
  summary: string;
}

export interface ResultSource {
  Topic: string;
  Unit: string;
  country: CountryPerValue[];
}

export interface CountryPerValue {
  country_name: string;
  values: YearPerValue[];
}

export interface YearPerValue {
  [year: string]: string; // Dynamic key for year-value pairs
}