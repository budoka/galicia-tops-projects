import { Button, Col, DatePicker, Form, Row, Select, Space, Tabs, Typography } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import { ArgsProps } from 'antd/lib/message';
import { LabeledValue } from 'antd/lib/select';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/app/store';
import { useAppDispatch } from 'src/app/store/hooks';
import { Texts } from 'src/constants/texts';
import { GastosForm, TransferenciaTabsNames } from 'src/features/transferencia/nueva-solicitud/data/types';
import { Rules } from 'src/types';
import { detallesGastos } from '..';

import { getOption, getRule, renderFormTitle, renderOptions } from '../../../../shared/ui/utils';
import { setActiveForm, setEstadoForm } from '../../logic';
import styles from './style.module.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Link } = Typography;
const { TabPane } = Tabs;

const width = 250;

const reglas: Rules = {
  gastos: {
    detalle: [
      {
        required: true,
        message: 'Detalle no válido',
      },
    ],
  },
  cuenta: [
    {
      required: true,
      message: 'Cuenta no válida',
    },
  ],
};

const DEFAULT_EXPENSE_DETAIL = getOption({ id: 'ben', label: 'BEN' }, 'label');

const loadingMessage: ArgsProps = {
  key: 'loading',
  type: 'loading',
  content: 'Cargando...',
  duration: 0,
};

interface GastoFormPanelProps {
  title: string;
  form: FormInstance<GastosForm>;
}

export const GastoFormPanel: React.FC<GastoFormPanelProps> = (props) => {
  const dispatch = useAppDispatch();

  const { title, form } = props;

  const nuevaSolicitud = useSelector((state: RootState) => state.transferencias.nuevaSolicitud);

  const [currentDetalleGastos, setCurrentDetalleGastos] = useState<LabeledValue>(DEFAULT_EXPENSE_DETAIL);

  // useEffects

  useEffect(() => {
    const currentActiveForm = nuevaSolicitud.ui.form.active;
    const currentStatus = nuevaSolicitud.ui.form.status.gastos;
    if (currentActiveForm === TransferenciaTabsNames.GASTOS && currentStatus) {
      const gastos = nuevaSolicitud.data.form?.datosOperacion?.gastos;
      const cuentaDebitoGastos = nuevaSolicitud.data.form?.datosOperacion?.cuentaDebitoGastos;
      form.resetFields();
      form.setFieldsValue({
        gastos: {
          ...gastos,
          detalle: getOption({ id: gastos?.detalle.id!, descripcion: gastos?.detalle.descripcion }, 'descripcion'),
        },
        cuentaDebitoGastos: getOption(
          {
            id: cuentaDebitoGastos?.numero!,
            descripcion: `${cuentaDebitoGastos?.tipoCuenta} | ${cuentaDebitoGastos?.moneda} | ${cuentaDebitoGastos?.numero}`,
          },
          'descripcion',
        ),
      });

      setCurrentDetalleGastos(form.getFieldsValue().gastos.detalle);
    }
  }, [nuevaSolicitud.ui.form.active]);

  // handlers

  const handleOnDetalleGastosChange = () => {
    console.log(form.getFieldsValue());
    setCurrentDetalleGastos(form.getFieldsValue().gastos.detalle);
  };

  const handleOnFinish = () => {
    dispatch(setEstadoForm({ gastos: true }));
    dispatch(setActiveForm(TransferenciaTabsNames.CUENTAS));
  };

  // renders

  return (
    <>
      <Form
        className={styles.form}
        form={form}
        layout="vertical"
        onFinish={handleOnFinish}
        initialValues={{ gasto: { detalle: DEFAULT_EXPENSE_DETAIL } }}>
        <Form.Item>{renderFormTitle(title)}</Form.Item>

        <Row wrap={false}>
          <Space size={'middle'}>
            <Col style={{ width: width }}>
              <Form.Item label={Texts.EXPENSE_DETAIL} name={['gastos', 'detalle']} rules={getRule(reglas, ['gastos', 'detalle'])} required>
                <Select labelInValue placeholder={Texts.SELECT_EXPENSE_DETAIL} onChange={handleOnDetalleGastosChange}>
                  {renderOptions(detallesGastos, 'descripcion')}
                </Select>
              </Form.Item>
            </Col>

            {'ben' !== currentDetalleGastos.value && (
              <Col style={{ width: width }}>
                <Form.Item
                  label={Texts.EXPENSE_DETAIL}
                  name={['gastos', 'detalle']}
                  rules={getRule(reglas, ['gastos', 'detalle'])}
                  required>
                  <Select labelInValue placeholder={Texts.SELECT_EXPENSE_DETAIL}>
                    {renderOptions(detallesGastos, 'descripcion')}
                  </Select>
                </Form.Item>
              </Col>
            )}
          </Space>
        </Row>

        <Form.Item style={{ position: 'sticky', top: 550 }} /* {...tailLayout} */>
          <Space>
            <Button type="primary" htmlType="submit">
              Confirmar
            </Button>

            {/*   <Button type="default" htmlType="button" onClick={handleReset}>
              Limpiar
            </Button>

            <Button type="link" htmlType="button" onClick={handleFill}>
              Completar
            </Button> */}
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};
