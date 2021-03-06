import { Button } from 'antd';
import React from 'react';
import { Texts } from 'src/constants/texts';

interface AddButtonProps {
  disabled: boolean;
  editing: boolean;
  onAdd: () => void;
  onCancel: () => void;
}

export const AddButton = React.memo((props: AddButtonProps) => {
  const { disabled, editing, onAdd, onCancel } = props;

  return !editing ? (
    <Button type="primary" disabled={disabled} onClick={onAdd}>
      {Texts.ADD}
    </Button>
  ) : (
    <Button type="ghost" disabled={disabled} onClick={onCancel}>
      {Texts.CANCEL}
    </Button>
  );
});
