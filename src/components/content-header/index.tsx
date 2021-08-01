import { Breadcrumb, Divider } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { matchPath } from 'react-router';
import { RootState } from 'src/app/store';
import { useAppSelector } from 'src/app/store/store.hooks';
import { STICKY, UNSELECTABLE } from 'src/constants';
import { MenuChildItem, MenuItem, MenuParentItem } from 'src/features/navigator-menu/ui/types';
import { BasicComponentProps } from 'src/types';
import { menuItems } from '../../app';
import { Scroll } from '../content-wrapper/interface';
import { Wrapper } from '../wrapper';
import styles from './style.module.less';

interface ContentHeaderProps extends Pick<BasicComponentProps<HTMLDivElement>, 'className' | 'style'> {
  scroll: Scroll;
}

export const ContentHeader: React.FC<ContentHeaderProps> = React.memo((props) => {
  const { scroll, children } = props;

  const [pin, setPin] = useState(false);

  useEffect(() => {
    setPin(scroll.y > 0);
  }, [scroll]);

  const wrapperClassName = classNames(STICKY, styles.wrapper, pin ? styles.wrapperPinned : undefined);
  //  const wrapperClassName = classNames(STICKY, pin ? styles.wrapperPinned : styles.wrapper);
  const wrapperContentClassName = classNames(styles.wrapperContent, pin ? styles.wrapperContentPinned : undefined);
  const className = classNames(UNSELECTABLE, props.className, styles.contentHeader);

  const router = useAppSelector((state: RootState) => state.router);

  const getItem = (path: string, items: MenuItem[]): MenuChildItem | undefined => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const child = item as MenuChildItem;

      const isEq =
        child.view &&
        matchPath(path, {
          path: child.view.path,
          exact: true,
          strict: true,
        });

      if (isEq) {
        //  console.log(child);
        return child;
      }
      const parent = item as MenuParentItem;

      if (parent.children) {
        const item = getItem(path, parent.children);
        if (item) return item;
      }
    }
  };

  const renderItem = () => {
    const item = getItem(router.location.pathname, menuItems)!;
    return (
      <>
        <Breadcrumb.Item>{item?.parent}</Breadcrumb.Item>
        <Breadcrumb.Item>{item?.view?.title}</Breadcrumb.Item>
      </>
    );
  };

  return (
    <>
      <Wrapper contentBody direction="row" vertical="middle" className={wrapperClassName}>
        <Wrapper contentBody direction="row" vertical="middle" horizontal="left" className={wrapperContentClassName}>
          <Breadcrumb className={className}>{renderItem()}</Breadcrumb> {children}
        </Wrapper>
      </Wrapper>

      <Divider style={{ marginTop: 0, left: 0, position: 'sticky' }} />
    </>
  );
});
