export interface FeatureState<T> {
  data: T;
  error: string | null;
}
/* 
export interface FormState<T> {
  data: Partial<T>;
  loading: boolean;
}
 */

export interface InfoState<T> {
  value: T;
}

export interface InfoAsyncState<T> {
  value: T;
  loading: boolean;
}
