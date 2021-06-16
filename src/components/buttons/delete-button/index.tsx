import { Button, Popconfirm } from 'antd';
import React from 'react';
import { Texts } from 'src/constants/texts';

interface DeleteButtonProps {
  disabled: boolean;
  onDelete: () => void;
}

export const DeleteButton = React.memo((props: DeleteButtonProps) => {
  const { disabled, onDelete } = props;

  return (
    <Popconfirm title={Texts.DELETE_SELECTED_ROWS} onConfirm={onDelete} okText={Texts.YES} cancelText={Texts.NO} disabled={disabled}>
      <Button type="primary" danger disabled={disabled}>
        {Texts.DELETE}
      </Button>
    </Popconfirm>
  );
});
