import { Rule } from 'antd/lib/form';

export interface BasicComponentProps<HTMLElement>
  extends React.DetailedHTMLProps<Omit<React.HTMLAttributes<HTMLElement>, 'unselectable'>, HTMLElement> {}

/* export interface BasicComponenetProps<HTMLElement>
  extends React.DetailedHTMLProps<React.HTMLAttributes<Omit<HTMLElement, 'unselectable'>>, Exclude<HTMLElement, 'unselectable'>> {}
 */

export type ExtractStringPropertyNames<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

export interface Dictionary<T> {
  [key: string]: T;
}

export interface ObjectLiteral {
  [key: string]: any;
}

export interface IElement extends ObjectLiteral {
  key: React.Key;
}

export interface Rules {
  [key: string]: Rule[] | Rules;
}

export interface QueryParams {
  select?: string[];
  where?: ObjectLiteral;
  offset?: number;
  limit?: number;
  order?: { [P in keyof any]?: 'ASC' | 'DESC' };
}

export interface CacheableState {
  cache: { key: string; expiration?: number };
}
