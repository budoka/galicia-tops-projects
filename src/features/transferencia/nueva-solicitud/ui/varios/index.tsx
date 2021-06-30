import { Button, Col, DatePicker, Form, Row, Select, Space, Tabs, Typography } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import { ArgsProps } from 'antd/lib/message';
import { LabeledValue } from 'antd/lib/select';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from 'src/app/store/hooks';
import { RootState } from 'src/app/store';
import { useAppDispatch } from 'src/app/store/hooks';
import { Texts } from 'src/constants/texts';
import {
  CuentasForm,
  DetalleGastosObj,
  GastosForm,
  TransferenciaTabsNames,
  VariosForm,
} from 'src/features/transferencia/nueva-solicitud/data/types';
import { Rules } from 'src/types';
import { detallesGastos } from '..';

import { getOption, getRule, renderFormTitle, renderOptions } from '../../../../shared/ui/utils';
import { setActiveForm, setDatosCuentas, setDatosGastos, setEstadoForm } from '../../logic';
import styles from './style.module.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Link } = Typography;
const { TabPane } = Tabs;

const width = 250;

const reglas: Rules = {
  cuentaDebito: [
    {
      required: true,
      message: 'Cuenta no válida',
    },
  ],
};

const loadingMessage: ArgsProps = {
  key: 'loading',
  type: 'loading',
  content: 'Cargando...',
  duration: 0,
};

interface VariosFormPanelProps {
  title: string;
  form: FormInstance<VariosForm>;
}

export const VariosFormPanel: React.FC<VariosFormPanelProps> = (props) => {
  const dispatch = useAppDispatch();

  const { title, form } = props;

  const nuevaSolicitud = useAppSelector((state: RootState) => state.transferencias.nuevaSolicitud);

  // useEffects

  useEffect(() => {
    const currentActiveForm = nuevaSolicitud.ui.form.active;
    const currentStatus = nuevaSolicitud.ui.form.status.cuentas;
    if (currentActiveForm === TransferenciaTabsNames.VARIOS && currentStatus) {
      const cuentaDebito = nuevaSolicitud.data.form?.datosOperacion?.cuentaDebito;
      form.resetFields();
      form.setFieldsValue({
        cuentaDebito: getOption(
          {
            id: cuentaDebito?.valor!,
            descripcion: cuentaDebito?.valor,
          },
          'descripcion',
        ),
      });
    }
  }, [nuevaSolicitud.ui.form.active]);

  // handlers

  const handleOnFinish = () => {
    setData();
    dispatch(setEstadoForm({ cuentas: true }));
    dispatch(setActiveForm(TransferenciaTabsNames.CONFIRMACION));
  };

  const setData = () => {
    /*  const { cuentaDebito } = form.getFieldsValue() || {};
    dispatch(setDatosCuentas(nuevaSolicitud.info.cuentas?.value?.find((c) => c.id === cuentaDebito?.value)!)); */
  };

  // renders

  return (
    <>
      <Form className={styles.form} form={form} layout="vertical" onFinish={handleOnFinish}>
        <Form.Item>{renderFormTitle(title)}</Form.Item>

        <Row wrap={false}>
          <Space size={'middle'}>
            <Col style={{ width: width }}>
              <Form.Item label={Texts.ACCOUNT} name={'cuentaDebito'} rules={getRule(reglas, 'cuentaDebito')} required>
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
