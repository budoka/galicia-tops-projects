import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select, Space } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import { ArgsProps } from 'antd/lib/message';
import React, { useEffect, useRef } from 'react';
import { RootState } from 'src/app/store';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import { Pattern } from 'src/constants';
import { Texts } from 'src/constants/texts';
import { Concepto } from 'src/features/_shared/data/interfaces';
import { Rules } from 'src/types/interfaces';
import { getOption, getRule, renderFormTitle, renderOptions } from '../../../../_shared/ui/utils';
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
  const dispatch = useAppDispatch();

  const { title, form } = props;

  const nuevaSolicitud = useAppSelector((state: RootState) => state.transferencia.nuevaSolicitud);

  const monedaRef = useRef<HTMLSelectElement>(null);
  const addAmountRef = useRef<HTMLButtonElement>(null);

  // useEffects

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
          concepto: getOption(
            {
              id: i.concepto?.id!,
              descripcion: i.concepto?.descripcion,
            },
            'descripcion',
          ),
        })),
        moneda: getOption(
          {
            id: moneda?.id!,
            descripcion: moneda?.descripcion,
          },
          'descripcion',
        ),
      });
    }
  }, [nuevaSolicitud.ui.form.active]);

  // handlers

  const handleOnFinish = () => {
    setData();
    dispatch(setEstadoForm({ importes: true }));
    if (isConfirmationEnabled('importes')) dispatch(setActiveForm(FormNames.CONFIRMACION));
  };

  const isConfirmationEnabled = (omittedStatus: string) => {
    const status = nuevaSolicitud.ui.form.status;

    return Object.values(status)
      .filter((s) => s !== omittedStatus)
      .every((s) => {
        return s === true;
      });
  };

  const setData = () => {
    /*  const { cuentaDebito } = form.getFieldsValue() || {};
    dispatch(setDatosCuentas(nuevaSolicitud.info.cuentas?.value?.find((c) => c.id === cuentaDebito?.value)!)); */

    const { importes, moneda } = form.getFieldsValue() || {};

    dispatch(
      setDatosImportes({
        importes: importes.map((i) => ({
          importe: i.importe,
          concepto: { id: i.concepto.value, descripcion: i.concepto.label } as Concepto,
        })),
        moneda: nuevaSolicitud.info.monedas?.value?.find((c) => c.id === moneda?.value)!,
      }),
    );
  };

  // renders

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
              loading={nuevaSolicitud.info.monedas?.loading}
              disabled={nuevaSolicitud.info.monedas?.loading}>
              {renderOptions(nuevaSolicitud.info.monedas?.value!, 'descripcion')}
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
                                loading={nuevaSolicitud.info.conceptos?.loading}
                                disabled={nuevaSolicitud.info.conceptos?.loading}>
                                {renderOptions(nuevaSolicitud.info.conceptos?.value!, 'descripcion')}
                              </Select>
                            </Form.Item>
                          </Col>
                          {fields.length > 1 && (
                            <Col>
                              <MinusCircleOutlined
                                onClick={() => {
                                  console.log(fields);
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
