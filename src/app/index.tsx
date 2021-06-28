import { ContainerOutlined, FileAddOutlined, HomeOutlined, RetweetOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import _ from 'lodash';
import { UserAgentApplication, Account } from 'msal';
import React, { createContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { matchPath } from 'react-router-dom';
import { useAzureAuth } from 'src/auth/hook/useAzureAuth';
import { ContentWrapper } from 'src/components/content-wrapper';
import { Header } from 'src/components/header';
import { LoadingContent } from 'src/components/loading';
import 'src/components/message/setup-message';
import { Router } from 'src/components/router';
import { Sider } from 'src/components/sider';
import { SiderChildItem, SiderItem } from 'src/components/sider/types';
import { APP_TITLE } from 'src/constants';
import { Texts } from 'src/constants/texts';
import 'src/api/setup/setup-axios';
import { useAppDispatch } from 'src/app/store/hooks';
import { getLegajoFromEmail } from 'src/utils/galicia';
import { views } from 'src/views';
import { BackToTop } from '../components/back-to-top';
import styles from './style.module.less';
import { RootState } from './store';

/**
 * Configuración de context para hacer funcionar la autenticacion con msal.
 * TODO: Se debe reemplazar por la library de msal nueva.
 */

export type State = {
  account?: Account;
  msalInstance?: UserAgentApplication;
};

export const StateContext = createContext<State>({});

/**
 * Inicio de App
 */

export const siderItems: SiderItem[] = [
  { view: views['Inicio'], icon: <HomeOutlined /> },
  { view: views['Mensajes'], icon: <ContainerOutlined /> },
  { title: Texts.REQUESTS, icon: <FileAddOutlined />, children: [{ view: views['Solicitudes'] }, { view: views['Crear_Solicitud'] }] },
  { title: Texts.TRANSFERS, icon: <RetweetOutlined />, children: [{ view: views['Crear_Transferencia'] }] },
].map((parent) => {
  if (!parent.children) return parent;
  return {
    ...parent,
    children: (parent.children as SiderChildItem[]).map((item) => ({ ...item, parent: parent.title })),
  };
});

export const App = () => {
  const dispatch = useAppDispatch();
  const auth = useAzureAuth();
  const router = useSelector((state: RootState) => state.router);
  const sesion = useSelector((state: RootState) => state.sesion.data);
  const contentRef = React.createRef();

  useEffect(() => {
    if (!auth.data || !_.isEmpty(sesion)) return;
    const nombreUsuario = auth.data.account?.name;
    const legajo = getLegajoFromEmail(auth.data.account?.username)!;
    // dispatch(fetchInfoSesion({ data: { nombreUsuario, legajo } }));
  }, [auth.data]);

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

  // TODO: Eliminar
  const [gS, setGS] = useState<State>({
    msalInstance: new UserAgentApplication({
      auth: {
        clientId: 'f688eaea-0d00-43aa-b7f8-5ea3a1770cc3',
        authority: 'https://login.microsoftonline.com/934de3fe-416c-4e4c-b035-32df9344eac4',
        redirectUri: window.location.origin,
      },
    }),
  });

  /* if (gS && gS.msalInstance) {
    gS.msalInstance.handleRedirectCallback((error, response) => {
      // console.log("REDIRECT CALLED BACK");
      // if (response) {
      //     console.log(response);
      // } else {
      //     console.log(error);
      // }
    });
  } */

  // TODO: Eliminar
  if (gS && gS.msalInstance && !gS.msalInstance.getAccount() && !gS.msalInstance.getLoginInProgress()) {
    gS.msalInstance.loginRedirect({ scopes: ['user.read'] });
  } else if (gS && gS.msalInstance && !gS.account) {
    setGS({ ...gS, account: gS.msalInstance.getAccount() });
  }

  /*   return !auth.disabled && _.isEmpty(sesion) ? (
    <LoadingContent />
  ) : (
    <>
      <Helmet titleTemplate={`%s | ${APP_TITLE}`}>
        <title>{getTitle()}</title>
      </Helmet>
      <Layout style={{ height: '100vh' }}>
        <Header className={styles.header} />
        <Layout className={styles.main}>
          <Sider items={siderItems} />
          <ContentWrapper className={styles.content}>
            <Router views={views} />
          </ContentWrapper>
        </Layout>
      </Layout>
      <BackToTop visibilityHeight={80} target={() => document.getElementById('content') || window} />
    </>
  );
 */

  // TODO: Reemplazar por la autenticacion con msal 2.
  return (
    <StateContext.Provider value={gS}>
      <Helmet titleTemplate={`%s | ${APP_TITLE}`}>
        <title>{getTitle()}</title>
      </Helmet>
      <Layout style={{ height: '100vh' }}>
        <Header className={styles.header} />
        <Layout className={styles.main}>
          <Sider items={siderItems} />
          <ContentWrapper className={styles.content}>
            <Router views={views} />
          </ContentWrapper>
        </Layout>
      </Layout>
      <BackToTop visibilityHeight={80} target={() => document.getElementById('content') || window} />
    </StateContext.Provider>
  );
};
