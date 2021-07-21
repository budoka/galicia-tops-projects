import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select, Space } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import React, { useEffect, useRef } from 'react';
import { RootState } from 'src/app/store';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import { Pattern } from 'src/constants';
import { Texts } from 'src/constants/texts';
import { Concepto } from 'src/features/_shared/data/interfaces';
import { Rules } from 'src/types/interfaces';
import { getRule, getValueFromOptions, renderFormTitle, renderOptions } from '../../../../_shared/ui/utils';
import { FormNames, ImporteForm, VariosForm } from '../../data/forms';
import { setActiveForm, setDatosImportes, setEstadoForm } from '../../logic';
import styles from './style.module.less';

const width = 250;

const rules: Rules = {
  importe: [
    {
      required: true,
      pattern: Pattern.CURRENCY_AMOUNT_POSITIVE,
      message: 'Importe no válido',
    },
  ],
  moneda: [
    {
      required: true,
      message: 'Moneda no válida',
    },
  ],
};

interface ImporteFormPanelProps {
  title: string;
  form: FormInstance<ImporteForm>;
  variosForm: FormInstance<VariosForm>;
}

export const ImporteFormPanel: React.FC<ImporteFormPanelProps> = (props) => {
  const { title, form, variosForm } = props;

  const dispatch = useAppDispatch();
  const nuevaSolicitud = useAppSelector((state: RootState) => state.ordenDePago.nuevaSolicitud);
  const shared = useAppSelector((state: RootState) => state.shared);

  const monedaRef = useRef<HTMLSelectElement>(null);
  const addAmountRef = useRef<HTMLButtonElement>(null);

  //#region UseEffects

  useEffect(() => {
    addAmountRef.current?.click();
    monedaRef.current?.focus();
  }, []);

  useEffect(() => {
    const currentActiveForm = nuevaSolicitud.ui.form.active;
    const currentStatus = nuevaSolicitud.ui.form.status.importe;
    if (currentActiveForm === FormNames.IMPORTES && currentStatus) {
      const { importe, moneda } = nuevaSolicitud.data.form?.detalles! || {};
      form.resetFields();
      form.setFieldsValue({
        importe,
        moneda: getValueFromOptions(moneda?.id!, shared?.monedas?.value!),
      });
    }
  }, [nuevaSolicitud.ui.form.active]);

  //#endregion

  //#region Handlers

  const handleOnFinish = () => {
    setData();
    dispatch(setEstadoForm({ importe: true, varios: false }));
    dispatch(setActiveForm(FormNames.VARIOS));
  };

  //#endregion

  //#region Other functions

  const setData = () => {
    const { importe, moneda } = form.getFieldsValue() || {};

    dispatch(
      setDatosImportes({
        importe,
        moneda: shared.monedas?.value?.find((c) => c.id === moneda?.value)!,
      }),
    );

    resetForms();
  };

  const resetForms = () => {
    if (nuevaSolicitud.ui.form.status.varios) variosForm.resetFields();
  };

  //#endregion

  return (
    <>
      <Form className={styles.form} form={form} layout="vertical" onFinish={handleOnFinish}>
        <Form.Item>{renderFormTitle(title)}</Form.Item>

        <Row wrap={false}>
          <Space size={'middle'}>
            <Col style={{ width: width }}>
              <Form.Item label={Texts.CURRENCY} name={'moneda'} rules={getRule(rules, 'moneda')} required>
                <Select
                  ref={monedaRef}
                  labelInValue
                  showSearch
                  optionFilterProp="children"
                  placeholder={Texts.SELECT_CURRENCY}
                  loading={shared.monedas?.loading}
                  disabled={shared.monedas?.loading}>
                  {renderOptions(shared.monedas?.value!, { labelKey: 'descripcion' })}
                </Select>
              </Form.Item>
            </Col>

            <Col style={{ width }}>
              <Form.Item label={Texts.AMOUNT} name={['importe']} rules={getRule(rules, 'importe')} required>
                <Input />
              </Form.Item>
            </Col>
          </Space>
        </Row>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Confirmar
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};
