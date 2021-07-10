import { Select, Typography } from 'antd';
import { Rule } from 'antd/lib/form';
import { LabeledValue } from 'antd/lib/select';
import React from 'react';
import { ObjectLiteral, Rules } from 'src/types/interfaces';
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

export function getValueFromOptions(value: string | number, options: ObjectLiteral[], optionKey: string = 'id', optionLabel: string = 'label'): LabeledValue {
  console.log(value, options);

  if (value === undefined || value === null) throw new Error(`Error obtener la opción. El valor pasado es '${value}'.`);

  const foundValue = options.find((o) => o[optionKey] === value);

  if (!foundValue) throw new Error(`Error obtener la opción. La propiedad '${optionKey}' no existe o el valor ${value} no existe`);

  const restOfProperties = Object.keys(foundValue).filter((k) => k !== 'id');

  const labelProperty = restOfProperties.length === 1 ? restOfProperties[0] : restOfProperties.find((p) => p === optionLabel);

  if (!labelProperty)
    if (optionLabel !== 'label') throw new Error(`Error al obtener la descripción. La opción no tiene la propiedad ${optionLabel}.`);
    else
      throw new Error(`Error al obtener la descripción. La opción tiene más de una propiedad. Por favor elija la propiedad que corresponda a la descripción.`);

  return { key: foundValue.id, value: foundValue.value ?? foundValue.id, label: foundValue[labelProperty] ?? foundValue.id } as LabeledValue;
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
