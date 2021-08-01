export type Scope = 'admin';

export interface View {
  title?: string;
  path?: string;
  component: JSX.Element;
  scope?: Scope;
  homePage?: boolean;
}
