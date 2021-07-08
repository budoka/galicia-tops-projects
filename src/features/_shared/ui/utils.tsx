import { Select, Typography } from 'antd';
import { Rule } from 'antd/lib/form';
import { LabeledValue } from 'antd/lib/select';
import React from 'react';
import { Rules } from 'src/types/interfaces';
import { Keyable } from '../data/interfaces';

const { Option } = Select;
const { Text } = Typography;

export const renderFormTitle = (title: string, fontSize = 18) => {
  return (
    <Text style={{ fontSize }} strong>
      {title}
    </Text>
  );
};

export function renderOptions<T extends Keyable>(options: T[], descriptionKey: string = 'value') {
  if (!options) return;

  return options.map((option) => (
    <Option key={option.id ?? option.value} value={option.value ?? option.id}>
      {option[descriptionKey] ?? option.id}
    </Option>
  ));
}

export function getOption<T extends Keyable>(option: T, descriptionKey: string = 'value') {
  return { key: option.id, value: option.value ?? option.id, label: option[descriptionKey] ?? option.id } as LabeledValue;
}

export const getRule = (rules: Rules, ruleName: string | string[]): Rule[] => {
  if (typeof ruleName === 'string') {
    if (rules[ruleName] === undefined) throw new Error(`Error al leer la regla: '${ruleName}'. La regla no existe.`);
    return rules[ruleName] as Rule[];
  } else {
    const [rule, innerRules] = ruleName;
    return getRule(rules[rule] as Rules, innerRules);
  }
};
