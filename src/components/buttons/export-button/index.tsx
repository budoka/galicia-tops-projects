import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { Texts } from 'src/constants/texts';
import { BasicComponentProps } from 'src/types';
import styles from './style.module.less';

interface ExportButtonProps extends BasicComponentProps<HTMLButtonElement> {
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const ExportButton = React.memo((props: ExportButtonProps) => {
  const { disabled, loading, onClick } = props;

  return (
    <Button className={styles.button} icon={<DownloadOutlined />} disabled={disabled} loading={loading} onClick={onClick}>
      {loading ? Texts.EXPORTING : Texts.EXPORT}
    </Button>
  );
});
