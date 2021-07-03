import { ContainerOutlined, FileAddOutlined, RetweetOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import _ from 'lodash';
import { Account, UserAgentApplication } from 'msal';
import React, { createContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { matchPath } from 'react-router-dom';
import 'src/api/setup/setup-axios';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import { useAzureAuth } from 'src/auth/hook/useAzureAuth';
import { ContentWrapper } from 'src/components/content-wrapper';
import { Header } from 'src/components/header';
import { LoadingContent } from 'src/components/loading';
import 'src/components/message/setup-message';
import { Router } from 'src/components/router';
import { ServiceError } from 'src/components/service-error';
import { APP_TITLE } from 'src/constants';
import { Texts } from 'src/constants/texts';
import { NavigatorMenu } from 'src/features/navigator-menu/ui';
import { MenuChildItem, MenuItem } from 'src/features/navigator-menu/ui/types';
import { setUsuario } from 'src/features/sesion/sesion.slice';
import { fetchConceptos, fetchCorresponsales, fetchMonedas, fetchPaises } from 'src/features/_shared/logic';
import { hasError, isFetchingData } from 'src/helpers/validations';
import { getFreshToken } from 'src/utils/auth';
import { getLegajoFromEmail } from 'src/utils/galicia';
import { views } from 'src/views';
import { BackToTop } from '../components/back-to-top';
import { RootState } from './store';
import styles from './style.module.less';

/**
 * Configuración de context para hacer funcionar la autenticacion con msal.
 * TODO: Se debe reemplazar el por la library de msal nueva (requiere sacar el context 'StateContext' y las referencias #REF-MSAL.
 *       A su vez se requiere cambiar la configuracion de Azure para que acepte
 */

export type State = {
  account?: Account;
  msalInstance?: UserAgentApplication;
};

export const StateContext = createContext<State>({});

/**
 * Inicio de App
 */

export const menuItems: MenuItem[] = [
  // { view: views['Inicio'], icon: <HomeOutlined /> },
  { view: views['Mensajes'], icon: <ContainerOutlined /> },
  {
    title: Texts.PAY_ORDER,
    icon: <FileAddOutlined />,
    children: [{ view: views['Crear_Solicitud_Orden_De_Pago'] }, { view: views['Crear_Instruccion_Orden_De_Pago'] }],
  },
  { title: Texts.TRANSFER, icon: <RetweetOutlined />, children: [{ view: views['Crear_Solicitud_Transferencia'] }] },
].map((parent) => {
  if (!parent.children) return parent;
  return {
    ...parent,
    children: (parent.children as MenuChildItem[]).map((item) => ({ ...item, parent: parent.title })),
  };
});

export const App = () => {
  const dispatch = useAppDispatch();
  const auth = useAzureAuth();
  const router = useAppSelector((state: RootState) => state.router);
  const sesion = useAppSelector((state: RootState) => state.sesion.data);
  const shared = useAppSelector((state: RootState) => state.shared);
  const contentRef = React.createRef();

  useEffect(() => {
    /*   console.log('********************************');
    console.log(auth, sesion); */
    if (!auth.data || !_.isEmpty(sesion)) return;
    const nombreUsuario = auth.data.account?.name;
    const legajo = getLegajoFromEmail(auth.data.account?.username)!;
    dispatch(setUsuario({ nombreUsuario, legajo }));
  }, [auth.data]);

  //#region UseEffect

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!hasError(shared)) fetchData();
  }, [router.location.key]);

  //#endregion

  //#region Other functions

  const fetchData = async () => {
    const token = await getFreshToken(gS.msalInstance!);

    dispatch(
      fetchMonedas({
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }),
    );

    dispatch(
      fetchPaises({
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }),
    );

    dispatch(
      fetchCorresponsales({
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }),
    );

    dispatch(
      fetchConceptos({
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }),
    );

    /*  return () => {
      dispatch(cleanState());
    }; */
  };

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

  // TODO: Eliminar
  // #REF-MSAL
  const [gS, setGS] = useState<State>({
    msalInstance: new UserAgentApplication({
      auth: {
        clientId: 'f688eaea-0d00-43aa-b7f8-5ea3a1770cc3',
        authority: 'https://login.microsoftonline.com/934de3fe-416c-4e4c-b035-32df9344eac4',
        redirectUri: window.location.origin,
      },
    }),
  });

  // TODO: Eliminar
  // #REF-MSAL
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
  // #REF-MSAL
  if (gS && gS.msalInstance && !gS.msalInstance?.getAccount() && !gS.msalInstance?.getLoginInProgress()) {
    gS?.msalInstance.loginRedirect({ scopes: ['user.read'] });
  } else if (gS && gS?.msalInstance && !gS.account) {
    setGS({ ...gS, account: gS?.msalInstance?.getAccount() });

    const nombreUsuario = gS?.msalInstance?.getAccount()?.name;
    const legajo = getLegajoFromEmail(gS?.msalInstance?.getAccount()?.userName)!;
    dispatch(setUsuario({ nombreUsuario, legajo }));
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
  // #REF-MSAL
  return (
    <StateContext.Provider value={gS}>
      <Helmet titleTemplate={`%s | ${APP_TITLE}`}>
        <title>{getTitle()}</title>
      </Helmet>
      <Layout style={{ height: '100vh' }}>
        <Header className={styles.header} />
        <Layout className={styles.main}>
          <NavigatorMenu items={menuItems} />
          <ContentWrapper className={styles.content}>
            {isFetchingData(shared) ? <LoadingContent /> : hasError(shared) ? <ServiceError /> : <Router views={views} />}
          </ContentWrapper>
        </Layout>
      </Layout>
      <BackToTop visibilityHeight={80} target={() => document.getElementById('content') || window} />
    </StateContext.Provider>
  );
};
