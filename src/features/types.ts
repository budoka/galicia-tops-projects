export interface BaseState {
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
  loading: boolean;
}
