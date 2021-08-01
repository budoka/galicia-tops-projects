import { Layout, Menu } from 'antd';
import { SiderProps } from 'antd/lib/layout';
import { MenuMode } from 'rc-menu/lib/interface';
import { MenuTheme } from 'antd/lib/menu/MenuContext';
import SubMenu from 'antd/lib/menu/SubMenu';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RootState } from 'src/app/store';
import { useAppDispatch, useAppSelector } from 'src/app/store/store.hooks';
import { SHADOW, STICKY, UNSELECTABLE } from 'src/constants';
import { setOpenMenu } from 'src/features/navigator-menu/logic';
import { ObjectLiteral } from 'src/types';
import { getMatchedPathname } from 'src/utils/history.utils';
import { View } from 'src/views/types';
import styles from './style.module.less';
import { MenuChildItem, MenuItem, MenuParentItem } from './types';

const { Sider } = Layout;

interface MenuProps extends SiderProps {
  items: MenuItem[];
  theme?: MenuTheme;
  mode?: MenuMode;
  collapsed?: boolean;
}

export const NavigatorMenu: React.FC<MenuProps> = React.memo((props) => {
  const siderClassNames = classNames(STICKY, UNSELECTABLE, SHADOW, props.className, styles.sider);

  const dispatch = useAppDispatch();
  const menu = useAppSelector((state: RootState) => state.menu);
  const router = useAppSelector((state: RootState) => state.router);

  useEffect(() => {
    const pathname = window.location.pathname;

    let views: ObjectLiteral = {};

    props.items.forEach((item) => {
      const children = (item as MenuParentItem).children;
      const child = item as MenuChildItem;
      if (children) {
        children.forEach((child) => {
          const view = { ...child.view };
          view.title = (item as MenuParentItem).title;
          const pathname = view.path;
          if (pathname) views[pathname] = view;
        });
      } else {
        const pathname = child.view.path;
        if (pathname) views[pathname] = child.view;
      }
    });

    Object.entries(views).some(([key, view]) => {
      if (key === pathname) {
        const menuTitle = (view as View).title;
        if (!menu.collapsed && key !== menu.openMenu && menuTitle !== menu.openMenu) dispatch(setOpenMenu((view as View).title!));
        return true;
      }
    });
  }, [router.location.pathname, menu.collapsed]);

  const onOpenChange = (currentMenu: React.Key[]) => {
    if (currentMenu.length > 0) {
      const menuTitle = currentMenu[currentMenu.length - 1].toString();
      if (menu.openMenu === menuTitle) return;
      dispatch(setOpenMenu(menuTitle));
    } else if (menu.openMenu) dispatch(setOpenMenu(''));
  };

  const renderMenu = (items: MenuItem[]) => {
    const isParentItem = (item: MenuItem) => {
      if ((item as MenuParentItem).children) return true;
      else return false;
    };

    return items.map((item, index) => {
      let key: string;
      let path: string;
      let title: string;

      if (isParentItem(item)) {
        // Parent
        key = title = (item as MenuParentItem).title;

        return (
          <SubMenu
            key={key}
            title={
              <span>
                {item.icon}
                {!menu.collapsed ? title : ''}
              </span>
            }>
            {renderMenu((item as MenuParentItem).children)}
          </SubMenu>
        );
      } else if ((item as MenuChildItem).view.path) {
        // Child
        key = path = (item as MenuChildItem).view.path!;
        title = (item as MenuChildItem).view.title!;

        return (
          <Menu.Item key={key} hidden={(item as MenuChildItem).hidden}>
            <Link to={path}>
              {item.icon}
              <span>{title}</span>
            </Link>
          </Menu.Item>
        );
      } else return undefined;
    });
  };

  const selectedKey = getMatchedPathname();

  return (
    <Sider className={siderClassNames} trigger={null} collapsible={true} collapsed={menu.collapsed}>
      <Menu
        selectedKeys={selectedKey ? [selectedKey] : undefined}
        // selectedKeys={[window.location.pathname]}
        openKeys={menu.openMenu ? [menu.openMenu] : []}
        onOpenChange={onOpenChange}
        onSelect={({ key, keyPath, selectedKeys, domEvent }) => {
          if (menu.collapsed) dispatch(setOpenMenu(''));
        }}
        theme={props.theme ?? 'light'}
        mode={props.mode ?? 'inline'}>
        {renderMenu(props.items)}
      </Menu>
    </Sider>
  );
});
