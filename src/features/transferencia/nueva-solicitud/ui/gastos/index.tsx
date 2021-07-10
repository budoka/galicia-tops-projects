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
  detalle: [
    {
      required: true,
      message: 'Detalle no válido',
    },
  ],
};

const DEFAULT_EXPENSE_DETAIL = getOption({ id: 'ben', label: 'BEN' }, 'label');

interface GastosFormPanelProps {
  title: string;
  form: FormInstance<GastosForm>;
}

export const GastosFormPanel: React.FC<GastosFormPanelProps> = (props) => {
  const { title, form } = props;

  const dispatch = useAppDispatch();
  const nuevaSolicitud = useAppSelector((state: RootState) => state.transferencia.nuevaSolicitud);

  //#region UseEffects

  useEffect(() => {
    const currentActiveForm = nuevaSolicitud.ui.form.active;
    const currentStatus = nuevaSolicitud.ui.form.status.gastos;
    if (currentActiveForm === FormNames.GASTOS && currentStatus) {
      const gastos = nuevaSolicitud.data.form?.datosOperacion?.gastos;
      const cuentaComisiones = nuevaSolicitud.data.form?.datosOperacion?.cuentaComisiones;
      form.resetFields();
      form.setFieldsValue({
        detalle: getOption({ id: gastos?.detalle.id!, descripcion: gastos?.detalle.descripcion }, 'descripcion'),
      });

      // setCurrentDetalleGastos(form.getFieldsValue().gastos.detalle);
    }
  }, [nuevaSolicitud.ui.form.active]);

  //#endregion

  //#region Handlers

  const handleOnFinish = () => {
    setData();
    dispatch(setEstadoForm({ gastos: true }));
    if (canAdvance()) dispatch(setActiveForm(FormNames.CUENTAS));
  };

  //#endregion

  //#region Other functions

  const setData = () => {
    const { detalle } = form.getFieldsValue() || {};
    console.log(form.getFieldsValue());
    dispatch(
      setDatosGastos({
        detalle: { id: detalle.value, descripcion: detalle.label } as DetalleGastos,
      }),
    );
  };

  const canAdvance = () => nuevaSolicitud.ui.form.status.datosClientes;

  //#endregion

  return (
    <>
      <Form className={styles.form} form={form} layout="vertical" onFinish={handleOnFinish} initialValues={{ gasto: { detalle: DEFAULT_EXPENSE_DETAIL } }}>
        <Form.Item>{renderFormTitle(title)}</Form.Item>

        <Row wrap={false}>
          <Space size={'middle'}>
            <Col style={{ width: width }}>
              <Form.Item label={Texts.EXPENSE_DETAIL} name={['detalle']} rules={getRule(rules, 'detalle')} required>
                <Select labelInValue placeholder={Texts.SELECT_EXPENSE_DETAIL} /* onChange={handleOnDetalleGastosChange} */>
                  {renderOptions(detallesGastos, 'descripcion')}
                </Select>
              </Form.Item>
            </Col>
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
