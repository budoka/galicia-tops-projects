import { Breadcrumb, Divider } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { matchPath } from 'react-router';
import { Router } from 'react-router-dom';
import { STICKY, UNSELECTABLE } from 'src/constants';
import { RootState } from 'src/reducers';
import { BasicComponentProps } from 'src/types';
import { useScroll } from 'src/utils/hooks';
import { views } from 'src/views';
import { siderItems } from '../../app';
import { Cart } from '../cart';
import { ContentHeader } from '../content-header';
import { SiderChildItem, SiderItem, SiderParentItem } from '../sider/types';
import { Wrapper } from '../wrapper';
import { Scroll } from './interface';
import styles from './style.module.less';

interface ContentWrapperProps extends Pick<BasicComponentProps<HTMLDivElement>, 'className' | 'style'> {}

export const ContentWrapper: React.FC<ContentWrapperProps> = React.memo((props) => {
  const { className, children } = props;

  const router = useSelector((state: RootState) => state.router);

  const [scroll, setScroll] = useState<Scroll>({ x: 0, y: 0 });

  useEffect(() => {
    setScroll({ x: 0, y: 0 });
    document.getElementById('content')?.scrollTo({ left: 0, top: 0 });
  }, [router.location.pathname]);

  const onScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    setScroll({ y: event.currentTarget.scrollTop });
  };

  return (
    <>
      <Content
        id="content"
        className={className}
        onScroll={(event: React.UIEvent<HTMLDivElement, UIEvent>) => {
          onScroll(event);
        }}>
        <ContentHeader scroll={scroll} />
        {children}
        {/*   <Footer info={<Link to="#">Portal Unificado v{version}</Link>} /> */}
      </Content>
    </>
  );
});
