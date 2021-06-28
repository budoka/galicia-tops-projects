import { Select, Typography } from 'antd';
import React from 'react';
import { Keyable } from 'src/features/shared/data/types';

const { Option } = Select;
const { Text } = Typography;

export const renderFormTitle = (title: string) => {
  return (
    <Text style={{ fontSize: 18 }} strong>
      {title}
    </Text>
  );
};

export function renderOptions<T extends Keyable>(options: T[], descriptionKey: string = 'value') {
  console.log(options);
  if (!options) return;

  return options.map((option) => (
    <Option key={option.id} value={option.id}>
      {option[descriptionKey]}
    </Option>
  ));
}
