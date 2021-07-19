import { View } from 'src/views/types';

export interface MenuParentItem {
  title: string;
  children: MenuChildItem[];
  icon?: React.ReactNode;
}

export interface MenuChildItem {
  view: View;
  parent?: string;
  icon?: React.ReactNode;
  hidden?: boolean;
}

export type MenuItem = MenuParentItem | MenuChildItem;
