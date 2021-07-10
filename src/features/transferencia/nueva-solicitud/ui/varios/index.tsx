import { Button, Col, DatePicker, Form, Row, Select, Space } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import moment from 'moment';
import React, { useEffect } from 'react';
import { RootState } from 'src/app/store';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import { DATE_DD_MM_YYYY_FORMAT } from 'src/constants';
import { Texts } from 'src/constants/texts';
import { Rules } from 'src/types/interfaces';
import { detallesGastos } from '..';
import { getRule, getValueFromOptions, renderFormTitle, renderOptions } from '../../../../_shared/ui/utils';
import { FormNames, VariosForm as VariosForm } from '../../data/forms';
import { DetalleGastos } from '../../data/interfaces';
import { setActiveForm, setDatosVarios, setEstadoForm } from '../../logic';
import styles from './style.module.less';

const width = 250;

const rules: Rules = {
  fechaEntrada: [
    {
      required: true,
      message: 'Fecha de Entrada no válida',
    },
  ],
  detalle: [
    {
      required: true,
      message: 'Detalle no válido',
    },
  ],
};

interface VariosFormPanelProps {
  title: string;
  form: FormInstance<VariosForm>;
}

export const VariosFormPanel: React.FC<VariosFormPanelProps> = (props) => {
  const { title, form } = props;

  const dispatch = useAppDispatch();
  const nuevaSolicitud = useAppSelector((state: RootState) => state.transferencia.nuevaSolicitud);

  //#region UseEffects

  useEffect(() => {
    const currentActiveForm = nuevaSolicitud.ui.form.active;
    const currentStatus = nuevaSolicitud.ui.form.status.varios;
    if (currentActiveForm === FormNames.VARIOS && currentStatus) {
      const { fechaEntrada, gastos } = nuevaSolicitud.data.form?.datosOperacion || {};

      form.resetFields();
      form.setFieldsValue({
        fechaEntrada: moment(fechaEntrada),
        detalle: getValueFromOptions(gastos?.detalle.id!, detallesGastos),
      });
    }
  }, [nuevaSolicitud.ui.form.active]);

  //#endregion

  //#region Handlers

  const handleOnFinish = () => {
    setData();
    dispatch(setEstadoForm({ varios: true }));
    if (canAdvance('varios')) dispatch(setActiveForm(FormNames.CONFIRMACION));
  };

  //#endregion

  //#region Other functions

  const setData = () => {
    const { fechaEntrada, detalle } = form.getFieldsValue() || {};

    dispatch(
      setDatosVarios({
        fechaEntrda: fechaEntrada.toISOString(),
        gastos: {
          detalle: { id: detalle.value, descripcion: detalle.label } as DetalleGastos,
        },
      }),
    );
  };

  const canAdvance = (omittedStatus: string) => {
    const status = nuevaSolicitud.ui.form.status;

    return Object.keys(status)
      .filter((key) => key !== omittedStatus)
      .every((key) => {
        return (status as any)[key] === true;
      });
  };

  //#endregion

  return (
    <>
      <Form className={styles.form} form={form} layout="vertical" onFinish={handleOnFinish}>
        <Form.Item>{renderFormTitle(title)}</Form.Item>

        <Row wrap={false}>
          <Space size={'middle'}>
            <Col style={{ width }}>
              <Form.Item label={Texts.ENTRY_DATE} name={'fechaEntrada'} rules={getRule(rules, 'fechaEntrada')}>
                <DatePicker format={DATE_DD_MM_YYYY_FORMAT} placeholder={Texts.SELECT_DATE} />
              </Form.Item>
            </Col>

            <Col style={{ width }}>
              <Form.Item label={Texts.EXPENSE_DETAIL} name={['detalle']} rules={getRule(rules, 'detalle')} required>
                <Select labelInValue placeholder={Texts.SELECT_EXPENSE_DETAIL}>
                  {renderOptions(detallesGastos, 'descripcion')}
                </Select>
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
