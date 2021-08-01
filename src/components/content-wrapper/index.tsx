import { Content } from 'antd/lib/layout/layout';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RootState } from 'src/app/store';
import { useAppSelector } from 'src/app/store/store.hooks';
import { APP_VERSION } from 'src/constants';
import { BasicComponentProps } from 'src/types';
import { ContentHeader } from '../content-header';
import { Footer } from '../footer';
import { Scroll } from './interface';

interface ContentWrapperProps extends Pick<BasicComponentProps<HTMLDivElement>, 'className' | 'style'> {
  authenticated: boolean;
}

export const ContentWrapper: React.FC<ContentWrapperProps> = React.memo((props) => {
  const { className, children } = props;

  const router = useAppSelector((state: RootState) => state.router);

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
      {props.authenticated ? (
        <Content
          id="content"
          className={className}
          onScroll={(event: React.UIEvent<HTMLDivElement, UIEvent>) => {
            onScroll(event);
          }}>
          <ContentHeader scroll={scroll} />
          {children}
          {<Footer info={<Link to="#">Selehann Interview v{APP_VERSION}</Link>} />}
        </Content>
      ) : (
        children
      )}
    </>
  );
});
