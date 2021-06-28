import { Breadcrumb, Divider } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { matchPath } from 'react-router';
import { RootState } from 'src/app/store';
import { STICKY, UNSELECTABLE } from 'src/constants';
import { BasicComponentProps } from 'src/types';
import { useScroll } from 'src/utils/hooks';
import { siderItems } from '../../app';
import { Cart } from '../cart';
import { Scroll } from '../content-wrapper/interface';
import { SiderChildItem, SiderItem, SiderParentItem } from '../sider/types';
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

  const router = useSelector((state: RootState) => state.router);

  const getItem = (path: string, items: SiderItem[]): SiderChildItem | undefined => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const child = item as SiderChildItem;

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
      const parent = item as SiderParentItem;

      if (parent.children) {
        const item = getItem(path, parent.children);
        if (item) return item;
      }
    }
  };

  const renderItem = () => {
    const item = getItem(router.location.pathname, siderItems)!;
    return (
      <>
        <Breadcrumb.Item>{item.parent}</Breadcrumb.Item>
        <Breadcrumb.Item>{item.view.title}</Breadcrumb.Item>
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
