import { Button, Col, Form, Input, Row, Select, Space } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import React, { useEffect } from 'react';
import { RootState } from 'src/app/store';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import { Texts } from 'src/constants/texts';
import { Rules } from 'src/types/interfaces';
import { getRule, getValueFromOptions, renderFormTitle, renderOptions } from '../../../../_shared/ui/utils';
import { CuentasForm, FormNames } from '../../data/forms';
import { setActiveForm, setDatosCuentas, setEstadoForm } from '../../logic';
import styles from './style.module.less';

const width = 250;

const rules: Rules = {
  cuentaDestino: [
    {
      required: true,
      message: 'Cuenta no válida',
    },
  ],
  cuentaOrigen: {
    swiftBanco: [
      {
        required: true,
        message: 'Swift no válido',
      },
    ],
    numero: [
      {
        required: true,
        message: 'Cuenta no válida',
      },
    ],
  },
};

interface CuentasFormPanelProps {
  title: string;
  form: FormInstance<CuentasForm>;
}

export const CuentasFormPanel: React.FC<CuentasFormPanelProps> = (props) => {
  const { title, form } = props;

  const dispatch = useAppDispatch();
  const nuevaSolicitud = useAppSelector((state: RootState) => state.ordenDePago.nuevaSolicitud);
  const shared = useAppSelector((state: RootState) => state.shared);

  //#region UseEffects

  useEffect(() => {
    const currentActiveForm = nuevaSolicitud.ui.form.active;
    const currentStatus = nuevaSolicitud.ui.form.status.cuentas;
    if (currentActiveForm === FormNames.CUENTAS && currentStatus) {
      const { cuentaDestino, ordenante } = nuevaSolicitud.data.form?.detalles || {};
      form.resetFields();
      form.setFieldsValue({
        cuentaOrigen: ordenante?.cuentaOrigen!,
        cuentaDestino: getValueFromOptions(cuentaDestino?.valor!, nuevaSolicitud.info.cuentas?.value!),
      });
    }
  }, [nuevaSolicitud.ui.form.active]);

  //#endregion

  //#region Handlers

  const handleOnFinish = () => {
    setData();
    dispatch(setEstadoForm({ cuentas: true }));
    dispatch(setActiveForm(FormNames.IMPORTES));
  };

  const handleFill = () => {
    form.setFieldsValue({
      cuentaOrigen: {
        swiftBanco: 'Nombre',
        numero: '1234567889',
      },
    });

    console.log(form.getFieldsValue());
  };

  //#endregion

  //#region Other functions

  const setData = () => {
    const { cuentaOrigen, cuentaDestino } = form.getFieldsValue() || {};
    dispatch(
      setDatosCuentas({
        cuentaOrigen: cuentaOrigen,
        cuentaDestino: nuevaSolicitud.info.cuentas?.value?.find((c) => c.id === cuentaDestino?.value)!,
      }),
    );
  };

  //#endregion

  return (
    <>
      <Form className={styles.form} form={form} layout="vertical" onFinish={handleOnFinish}>
        <Form.Item>{renderFormTitle(title)}</Form.Item>

        <Form.Item>{renderFormTitle(Texts.ACCOUNT_CLIENT, 16)}</Form.Item>

        <Row wrap={false}>
          <Space size={'middle'}>
            <Col style={{ width }}>
              <Form.Item label={Texts.ACCOUNT_TARGET} name={'cuentaDestino'} rules={getRule(rules, 'cuentaDestino')} required>
                <Select
                  labelInValue
                  placeholder={Texts.SELECT_ACCOUNT}
                  loading={nuevaSolicitud.info.cuentas?.loading}
                  disabled={nuevaSolicitud.info.cuentas?.loading}>
                  {renderOptions(nuevaSolicitud.info.cuentas?.value!, 'valor')}
                </Select>
              </Form.Item>
            </Col>
          </Space>
        </Row>

        <Form.Item>{renderFormTitle(Texts.ACCOUNT_OUR, 16)}</Form.Item>

        <Row wrap={false}>
          <Space size={'middle'}>
            <Col style={{ width }}>
              <Form.Item label={Texts.BANK} name={['cuentaOrigen', 'swiftBanco']} rules={getRule(rules, ['cuentaOrigen', 'swiftBanco'])}>
                <Input />
              </Form.Item>
            </Col>

            <Col style={{ width }}>
              <Form.Item label={Texts.ACCOUNT_NUMBER} name={['cuentaOrigen', 'numero']} rules={getRule(rules, ['cuentaOrigen', 'numero'])}>
                <Input />
              </Form.Item>
            </Col>
          </Space>
        </Row>

        <Form.Item style={{ position: 'sticky', top: 550 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              Confirmar
            </Button>
            <Button type="link" htmlType="button" onClick={handleFill}>
              Completar
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};
