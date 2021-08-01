import { CompassFilled, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import { LayoutProps } from 'antd/lib/layout';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { RootState } from 'src/app/store';
import { useAppDispatch, useAppSelector } from 'src/app/store/store.hooks';
import { APP_TITLE, SHADOW, STICKY, UNSELECTABLE } from 'src/constants';
import { Texts } from 'src/constants/texts';
import { setOrientation } from 'src/features/configuracion/configuracion.slice';
import { setOpenMenu, toggleButtonVisible, toggleCollapse, toggleForcedCollapse } from 'src/features/navigator-menu/logic';
import { useWindowSize } from 'src/hooks/window-size.hook';
import { goHome } from 'src/utils/history.utils';
import { getScreenOrientation } from 'src/utils/screen.utils';
import { FlickerImage } from '../flicker-image';
import { logout } from 'src/features/auth/logic';
import styles from './style.module.less';
import exit from 'src/_assets/exit.svg';
import exitHover from 'src/_assets/exit-hover.svg';
import _ from 'lodash';
import { Message } from 'src/helpers/message.helper';
import { useHistory } from 'react-router-dom';

const { Header: HeaderAnt } = Layout;

interface HeaderProps extends LayoutProps {
  hideSiderButton?: boolean;
}

const WIDTH = 800;

export const Header: React.FC<HeaderProps> = (props) => {
  const username = useAppSelector((s) => s.auth.data.session?.username!);
  const settings = useAppSelector((s) => s.configuracion);
  const menu = useAppSelector((s) => s.menu);
  const dispatch = useAppDispatch();
  const size = useWindowSize();

  const [rotate, setRotate] = useState(false);
  const history = useHistory();

  const headerClassName = classNames(STICKY, UNSELECTABLE, SHADOW, props.className, styles.header);

  /* Icon rotation effect */
  useEffect(() => {
    setTimeout(
      () => {
        setRotate(!rotate);
      },
      rotate ? 2500 : 5000,
    );
  }, [rotate]);

  useEffect(() => {
    const orientation = getScreenOrientation(size);
    if (orientation !== settings.orientation) dispatch(setOrientation(orientation));

    const shouldCollapse = size.width <= WIDTH;
    if (shouldCollapse) {
      if (shouldCollapse !== menu.collapsed || shouldCollapse === menu.forcedCollapsed) {
        if (menu.buttonVisible) dispatch(toggleButtonVisible(false));
        if (menu.openMenu) dispatch(setOpenMenu(''));
      }
    } else {
      if (shouldCollapse !== menu.collapsed) {
        if (!menu.buttonVisible) dispatch(toggleButtonVisible(true));
        if (!menu.forcedCollapsed) handleCollapsed(false);
      }
    }
  }, [size]);

  useEffect(() => {
    if (!menu.collapsed && (!menu.buttonVisible || menu.forcedCollapsed)) handleCollapsed(true);
    //if (!menu.openMenu && !menu.collapsed) handleCollapsed(true);
  }, [menu.openMenu]);

  useEffect(() => {
    const shouldIgnore = size.width <= WIDTH;
    if (shouldIgnore) return;
    else if (menu.forcedCollapsed) {
      if (menu.openMenu) dispatch(setOpenMenu(''));
      else handleCollapsed(true);
    } else handleCollapsed(false);
  }, [menu.forcedCollapsed]);

  const handleCollapsed = (shouldCollapse: boolean) => {
    if (shouldCollapse !== menu.collapsed) dispatch(toggleCollapse(shouldCollapse));
  };

  const handleForcedCollapsed = (shouldForceCollapse: boolean) => {
    if (shouldForceCollapse !== menu.forcedCollapsed) dispatch(toggleForcedCollapse(shouldForceCollapse));
  };

  const renderLogo = () => {
    return (
      <div className={styles.logoWrapper}>
        <div className={styles.logo}>
          <Button type="link" size="large" style={{ display: 'flex' }} onClick={goHome}>
            <CompassFilled style={{ fontSize: '26px', minWidth: '50px' }} spin={rotate} /> {APP_TITLE}
          </Button>
        </div>
      </div>
    );
  };

  const renderSiderButton = () => {
    return !props.hideSiderButton && menu.buttonVisible /*!(menu.device === 'mobile' && menu.orientation === 'portrait')*/ ? (
      <div className={styles.siderButtonWrapper}>
        {menu.collapsed ? (
          <MenuUnfoldOutlined className={styles.siderButton} onClick={() => handleForcedCollapsed(false)} />
        ) : (
          <MenuFoldOutlined className={styles.siderButton} onClick={() => handleForcedCollapsed(true)} />
        )}
      </div>
    ) : null;
  };

  const renderUserInfo = () => {
    return (
      <div className={styles.rightWrapper}>
        <span className={styles.right}>
          {Texts.USER + ': '}
          <span className={styles.info}>{_.capitalize(username)}</span>
        </span>
        <FlickerImage
          wrapperClassName={styles.logoutWrapper}
          className={styles.logout}
          src={exit}
          altsrc={exitHover}
          alt="Salir"
          onClick={() => {
            dispatch(logout());
            history.push('auth');
            Message.info('Session finished!');
          }}
        />
      </div>
    );
  };

  return (
    <HeaderAnt className={headerClassName}>
      {renderLogo()}
      {renderSiderButton()}
      {renderUserInfo()}
    </HeaderAnt>
  );
};
