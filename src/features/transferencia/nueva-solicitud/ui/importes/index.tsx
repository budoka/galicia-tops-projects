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
import { FormNames, ImportesForm } from '../../data/forms';
import { setActiveForm, setDatosImportes, setEstadoForm } from '../../logic';
import styles from './style.module.less';

const width = 250;

const rules: Rules = {
  importes: {
    importe: [
      {
        required: true,
        pattern: Pattern.CURRENCY_AMOUNT_POSITIVE,
        message: 'Importe no válido',
      },
    ],
    concepto: [
      {
        required: true,
        message: 'Concepto no válido',
      },
    ],
  },
  moneda: [
    {
      required: true,
      message: 'Moneda no válida',
    },
  ],
};

interface ImportesFormPanelProps {
  title: string;
  form: FormInstance<ImportesForm>;
}

export const ImportesFormPanel: React.FC<ImportesFormPanelProps> = (props) => {
  const { title, form } = props;

  const dispatch = useAppDispatch();
  const nuevaSolicitud = useAppSelector((state: RootState) => state.transferencia.nuevaSolicitud);
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
    const currentStatus = nuevaSolicitud.ui.form.status.importes;
    if (currentActiveForm === FormNames.IMPORTES && currentStatus) {
      const { importes, moneda } = nuevaSolicitud.data.form?.datosOperacion! || {};
      form.resetFields();
      form.setFieldsValue({
        importes: importes.map((i) => ({
          importe: i.importe,
          concepto: getValueFromOptions(i.concepto?.id!, shared?.conceptos?.value!),
        })),
        moneda: getValueFromOptions(moneda?.id!, shared?.monedas?.value!),
      });
    }
  }, [nuevaSolicitud.ui.form.active]);

  //#endregion

  //#region Handlers

  const handleOnFinish = () => {
    setData();
    dispatch(setEstadoForm({ importes: true }));
    dispatch(setActiveForm(FormNames.VARIOS));
  };

  //#endregion

  //#region Other functions

  const setData = () => {
    const { importes, moneda } = form.getFieldsValue() || {};

    dispatch(
      setDatosImportes({
        importes: importes.map((i) => ({
          importe: i.importe,
          concepto: { id: i.concepto.value, descripcion: i.concepto.label } as Concepto,
        })),
        moneda: shared.monedas?.value?.find((c) => c.id === moneda?.value)!,
      }),
    );
  };

  //#endregion

  return (
    <>
      <Form className={styles.form} form={form} layout="vertical" onFinish={handleOnFinish}>
        <Form.Item>{renderFormTitle(title)}</Form.Item>

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
              {renderOptions(shared.monedas?.value!, 'descripcion')}
            </Select>
          </Form.Item>
        </Col>

        {/*      <Col style={{ width: width }}>
              <Form.Item label={Texts.AMOUNT} name={['importes', 'importe']} rules={getRule(reglas, ['importes', 'importe'])} required>
                <Input />
              </Form.Item>
            </Col> */}

        <Row wrap={false}>
          <Space size={'middle'}>
            <Form.List name={'importes'}>
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field, index) => (
                    <Form.Item key={field.key} style={{ marginBottom: 0 }}>
                      <Row wrap={false}>
                        <Space size={'middle'}>
                          <Col style={{ width: width }}>
                            <Form.Item
                              label={Texts.AMOUNT}
                              name={[field.name, 'importe']}
                              key={field.fieldKey}
                              //fieldKey={[field.fieldKey, 'importe']}
                              rules={getRule(rules, ['importes', 'importe'])}
                              required>
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col style={{ width: width }}>
                            <Form.Item
                              label={Texts.CONCEPT}
                              name={[field.name, 'concepto']}
                              key={field.fieldKey}
                              // fieldKey={[field.fieldKey, 'concepto']}
                              rules={getRule(rules, ['importes', 'concepto'])}
                              required>
                              <Select
                                labelInValue
                                showSearch
                                optionFilterProp="children"
                                placeholder={Texts.SELECT_CONCEPT}
                                loading={shared.conceptos?.loading}
                                disabled={shared.conceptos?.loading}>
                                {renderOptions(shared.conceptos?.value!, 'descripcion')}
                              </Select>
                            </Form.Item>
                          </Col>
                          {fields.length > 1 && (
                            <Col>
                              <MinusCircleOutlined
                                onClick={() => {
                                  remove(field.name);
                                }}
                              />
                            </Col>
                          )}
                        </Space>
                      </Row>
                    </Form.Item>
                  ))}
                  {fields.length < 3 && (
                    <Col style={{ width: width }}>
                      <Form.Item>
                        <Button ref={addAmountRef} type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                          Agregar Importe
                        </Button>

                        {/*             <Form.ErrorList errors={errors} /> */}
                      </Form.Item>
                    </Col>
                  )}
                </>
              )}
            </Form.List>
          </Space>
        </Row>

        <Form.Item style={{ position: 'sticky', top: 550 }}>
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
