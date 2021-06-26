import React from 'react';
import { Select, Typography } from 'antd';
import { OpcionEx } from 'src/types';

const { Option } = Select;
const { Text } = Typography;

export const renderFormTitle = (title: string) => {
  return (
    <Text style={{ fontSize: 18 }} strong>
      {title}
    </Text>
  );
};

export const renderOptions = (options?: OpcionEx[]) => {
  console.log(options);
  if (!options) return;

  return options.map((option) => (
    <Option key={option.value} value={option.value}>
      {option.label}
    </Option>
  ));
};
