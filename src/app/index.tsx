import { ContainerOutlined, HomeOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { matchPath, useHistory } from 'react-router-dom';
import 'src/api/setup/axios.config';
import { useAppDispatch, useAppSelector } from 'src/app/store/store.hooks';
import { ContentWrapper } from 'src/components/content-wrapper';
import { Header } from 'src/components/header';
import { LoadingContent } from 'src/components/loading';
import { Router } from 'src/components/router';
import { ServiceError } from 'src/components/service-error';
import { APP_TITLE } from 'src/constants';
import { Texts } from 'src/constants/texts';
import { getAccessToken, logout } from 'src/features/auth/logic';
import { NavigatorMenu } from 'src/features/navigator-menu/ui';
import { MenuItem, MenuParentItem } from 'src/features/navigator-menu/ui/types';
import { Message } from 'src/helpers/message.helper';
import { hasError, isFetchingData } from 'src/helpers/validation.helper';
import { tokenIsExpiredOrNull } from 'src/utils/auth.utils';
import { views } from 'src/views';
import { BackToTop } from '../components/back-to-top';
import { RootState } from './store';
import styles from './style.module.less';

/**
 * App
 */

export const menuItems: MenuItem[] = [{ view: views['Home'], icon: <HomeOutlined /> }].map((item: MenuItem) => {
  const parent: MenuParentItem | null = !!(item as MenuParentItem).children ? (item as MenuParentItem) : null;
  if (!parent) return item;
  return {
    ...parent,
    children: parent.children.map((item) => ({ ...item, parent: parent.title })),
  };
});

export const App = () => {
  const dispatch = useAppDispatch();
  const router = useAppSelector((state: RootState) => state.router);
  const { accessToken, refreshToken } = useAppSelector((s) => s.auth.data.session) || {};
  const shared = useAppSelector((state: RootState) => state.shared);
  const history = useHistory();
  const [authenticated, setAuthenticated] = useState(false);

  const fetchData = async () => {
    console.log('fetchData');
  };

  //#region UseEffect

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (hasError(shared)) {
      fetchData();
    }
    const validateToken = async () => {
      // Check if access token is expired or is null
      const accessTokenExpiredOrNull = tokenIsExpiredOrNull(accessToken);
      const refreshTokenExpiredOrNull = tokenIsExpiredOrNull(refreshToken);

      console.log('useEffect - router.location.key', accessTokenExpiredOrNull, accessTokenExpiredOrNull);
      console.log(router.location.pathname);
      // Check if access token is expired or is null
      if (accessTokenExpiredOrNull && !refreshTokenExpiredOrNull) {
        const result = await dispatch(getAccessToken({ body: { refreshToken: refreshToken! } }));

        if (getAccessToken.rejected.match(result)) {
          if (accessToken || refreshToken) dispatch(logout());
          history.push('auth');
          Message.info(Texts.SESSION_EXPIRED);
        }
      } else if (accessTokenExpiredOrNull && refreshTokenExpiredOrNull && !router.location.pathname.startsWith('/auth')) {
        setAuthenticated(false);
        // Message.info('Session expired!');
        history.push('auth');
      }
    };

    validateToken();
  }, [router.location.key]);

  useEffect(() => {
    const isAuth = !tokenIsExpiredOrNull(accessToken);
    console.log('useEffect - AccesToken', isAuth);
    setAuthenticated(isAuth);
  }, [accessToken]);

  //#endregion

  //#region Other functions

  const getTitle = () => {
    const view = Object.values(views).find((v) => {
      return matchPath(router.location.pathname, {
        path: v.path,
        exact: true,
        strict: true,
      });
    });

    const title = view ? view.title : views.Not_Found.title;
    return title;
  };

  //#endregion

  return false ? (
    <LoadingContent />
  ) : (
    <>
      <Helmet titleTemplate={`%s | ${APP_TITLE}`}>
        <title>{getTitle()}</title>
      </Helmet>
      <Layout style={{ height: '100vh' }}>
        {authenticated && <Header className={styles.header} />}
        <Layout className={styles.main}>
          {authenticated && <NavigatorMenu items={menuItems} />}
          <ContentWrapper className={styles.content} authenticated={authenticated}>
            {isFetchingData(shared) ? <LoadingContent /> : hasError(shared) ? <ServiceError /> : <Router views={views} />}
          </ContentWrapper>
        </Layout>
      </Layout>
      <BackToTop visibilityHeight={80} target={() => document.getElementById('content') || window} />
    </>
  );
};
