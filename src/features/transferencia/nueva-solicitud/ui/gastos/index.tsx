import { Button, Col, Form, Row, Select, Space } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import { ArgsProps } from 'antd/lib/message';
import React, { useEffect } from 'react';
import { RootState } from 'src/app/store';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import { Texts } from 'src/constants/texts';
import { Rules } from 'src/types/interfaces';
import { detallesGastos } from '..';
import { getOption, getRule, renderFormTitle, renderOptions } from '../../../../_shared/ui/utils';
import { FormNames, GastosForm } from '../../data/forms';
import { DetalleGastos } from '../../data/interfaces';
import { setActiveForm, setDatosGastos, setEstadoForm } from '../../logic';
import styles from './style.module.less';

const width = 250;

const rules: Rules = {
  gastos: {
    detalle: [
      {
        required: true,
        message: 'Detalle no válido',
      },
    ],
  },
  cuentaDebitoGastos: [
    {
      required: true,
      message: 'Cuenta no válida',
    },
  ],
};

const DEFAULT_EXPENSE_DETAIL = getOption({ id: 'ben', label: 'BEN' }, 'label');

interface GastosFormPanelProps {
  title: string;
  form: FormInstance<GastosForm>;
}

export const GastosFormPanel: React.FC<GastosFormPanelProps> = (props) => {
  const dispatch = useAppDispatch();

  const { title, form } = props;

  const nuevaSolicitud = useAppSelector((state: RootState) => state.transferencia.nuevaSolicitud);

  //const [currentDetalleGastos, setCurrentDetalleGastos] = useState<LabeledValue>(DEFAULT_EXPENSE_DETAIL);

  // useEffects

  useEffect(() => {
    const currentActiveForm = nuevaSolicitud.ui.form.active;
    const currentStatus = nuevaSolicitud.ui.form.status.gastos;
    if (currentActiveForm === FormNames.GASTOS && currentStatus) {
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
            id: cuentaDebitoGastos?.valor!,
            descripcion: cuentaDebitoGastos?.valor,
            //  descripcion: `${cuentaDebitoGastos?.codigo} | ${cuentaDebitoGastos?.monedaIso} | ${cuentaDebitoGastos?.numero}`,
          },
          'descripcion',
        ),
      });

      // setCurrentDetalleGastos(form.getFieldsValue().gastos.detalle);
    }
  }, [nuevaSolicitud.ui.form.active]);

  // handlers

  /*   const handleOnDetalleGastosChange = () => {
    setCurrentDetalleGastos(form.getFieldsValue().gastos.detalle);
  }; */

  const handleOnFinish = () => {
    setData();
    dispatch(setEstadoForm({ gastos: true }));
    dispatch(setActiveForm(FormNames.CUENTAS));
  };

  const setData = () => {
    const { gastos, cuentaDebitoGastos } = form.getFieldsValue() || {};
    dispatch(
      setDatosGastos({
        gastos: {
          ...gastos,
          detalle: { id: gastos.detalle.value, descripcion: gastos.detalle.label } as DetalleGastos,
        },
        cuentaDebitoGastos: nuevaSolicitud.info.cuentas?.value?.find((c) => c.id === cuentaDebitoGastos?.value)!,
      }),
    );
  };

  // renders

  return (
    <>
      <Form className={styles.form} form={form} layout="vertical" onFinish={handleOnFinish} initialValues={{ gasto: { detalle: DEFAULT_EXPENSE_DETAIL } }}>
        <Form.Item>{renderFormTitle(title)}</Form.Item>

        <Row wrap={false}>
          <Space size={'middle'}>
            <Col style={{ width: width }}>
              <Form.Item label={Texts.EXPENSE_DETAIL} name={['gastos', 'detalle']} rules={getRule(rules, ['gastos', 'detalle'])} required>
                <Select labelInValue placeholder={Texts.SELECT_EXPENSE_DETAIL} /* onChange={handleOnDetalleGastosChange} */>
                  {renderOptions(detallesGastos, 'descripcion')}
                </Select>
              </Form.Item>
            </Col>

            {
              /* 'ben' !== currentDetalleGastos.value && */ <Col style={{ width: width }}>
                <Form.Item label={Texts.ACCOUNT} name={'cuentaDebitoGastos'} rules={getRule(rules, 'cuentaDebitoGastos')} required>
                  <Select
                    labelInValue
                    placeholder={Texts.SELECT_ACCOUNT}
                    loading={nuevaSolicitud.info.cuentas?.loading}
                    disabled={nuevaSolicitud.info.cuentas?.loading}>
                    {renderOptions(nuevaSolicitud.info.cuentas?.value!, 'valor')}
                  </Select>
                </Form.Item>
              </Col>
            }
          </Space>
        </Row>

        <Form.Item style={{ position: 'sticky', top: 550 }} /* {...tailLayout} */>
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
