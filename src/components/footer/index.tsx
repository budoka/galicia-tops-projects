import { Layout } from 'antd';
import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { SHADOW, UNSELECTABLE } from 'src/constants';
import { BasicComponentProps } from 'src/types';
import { Wrapper } from '../wrapper';
import styles from './style.module.less';

const { Footer: FooterAnt } = Layout;

export interface FooterProps extends BasicComponentProps<HTMLDivElement> {
  hide?: boolean;
  info?: ReactNode;
}

export const Footer: React.FC<FooterProps> = React.memo((props) => {
  const { info, hide } = props;

  const className = classNames(UNSELECTABLE, SHADOW, props.className, styles.footer);
  const wrapperInfoClassName = classNames(props.className);

  return (
    <>
      {hide ? undefined : (
        <FooterAnt {...props} className={className}>
          <Wrapper className={wrapperInfoClassName}>{info}</Wrapper>
        </FooterAnt>
      )}
    </>
  );
});
