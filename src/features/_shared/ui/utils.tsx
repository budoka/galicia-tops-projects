import { Select, Typography } from 'antd';
import { Rule } from 'antd/lib/form';
import { LabeledValue } from 'antd/lib/select';
import React from 'react';
import { ObjectLiteral, Rules } from 'src/types';
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

export function renderOptions<T extends Keyable>(options: T[], keys?: { idKey?: string; valueKey?: string; labelKey?: string }) {
  if (!options) return;

  const idKey = keys?.idKey ?? 'id';
  const valueKey = keys?.valueKey ?? 'value';
  const labelKey = keys?.labelKey ?? 'value';

  return options.map((option) => {
    return (
      <Option key={option[idKey]} id={option[idKey]} value={option[valueKey] ?? option[idKey]}>
        {option[labelKey] ?? option[valueKey]}
      </Option>
    );
  });
}

export function getValueFromOptions(
  value: string | number,
  options: ObjectLiteral[],
  keys?: { idKey?: string; valueKey?: string; labelKey?: string },
): LabeledValue {
  if (value === undefined || value === null) throw new Error(`Error obtener la opción. El valor pasado es '${value}'.`);

  const idKey = keys?.idKey ?? 'id';
  const valueKey = keys?.valueKey ?? 'value';
  const labelKey = keys?.labelKey ?? 'label';

  const foundValue = options.find((o) => o[idKey] === value);

  if (!foundValue) throw new Error(`Error obtener la opción. La propiedad '${idKey}' no existe o el valor ${value} no existe`);

  const restOfProperties = Object.keys(foundValue).filter((k) => k !== 'id');

  const labelProperty = restOfProperties.length === 1 ? restOfProperties[0] : restOfProperties.find((p) => p === labelKey);

  if (!labelProperty)
    if (labelKey !== 'label') throw new Error(`Error al obtener la descripción. La opción no tiene la propiedad ${labelKey}.`);
    else
      throw new Error(`Error al obtener la descripción. La opción tiene más de una propiedad. Por favor elija la propiedad que corresponda a la descripción.`);

  return { key: foundValue[idKey], value: foundValue[valueKey] ?? foundValue[idKey], label: foundValue[labelProperty] ?? foundValue[valueKey] } as LabeledValue;
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
