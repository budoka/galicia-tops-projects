import { Button, Col, Form, Row, Select, Space } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import React, { useEffect } from 'react';
import { RootState } from 'src/app/store';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import { Texts } from 'src/constants/texts';
import { Rules } from 'src/types/interfaces';
import { getOption, getRule, renderFormTitle, renderOptions } from '../../../../_shared/ui/utils';
import { FormNames, VariosForm } from '../../data/forms';
import { setActiveForm, setEstadoForm } from '../../logic';
import styles from './style.module.less';

const width = 250;

const rules: Rules = {
  cuentaDebito: [
    {
      required: true,
      message: 'Cuenta no válida',
    },
  ],
};

interface VariosFormPanelProps {
  title: string;
  form: FormInstance<VariosForm>;
}

export const VariosFormPanel: React.FC<VariosFormPanelProps> = (props) => {
  const dispatch = useAppDispatch();

  const { title, form } = props;

  const nuevaSolicitud = useAppSelector((state: RootState) => state.transferencia.nuevaSolicitud);

  // useEffects

  useEffect(() => {
    const currentActiveForm = nuevaSolicitud.ui.form.active;
    const currentStatus = nuevaSolicitud.ui.form.status.cuentas;
    if (currentActiveForm === FormNames.VARIOS && currentStatus) {
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
    dispatch(setActiveForm(FormNames.CONFIRMACION));
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
              <Form.Item label={Texts.ACCOUNT} name={'cuentaDebito'} rules={getRule(rules, 'cuentaDebito')} required>
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
