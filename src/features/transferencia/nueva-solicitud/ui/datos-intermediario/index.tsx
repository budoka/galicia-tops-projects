import { Button, Col, Form, Row, Space } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import React, { useEffect } from 'react';
import { RootState } from 'src/app/store';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import { NuevaSolicitudFormState } from 'src/features/transferencia/nueva-solicitud/data/interfaces';
import { Rules } from 'src/types/interfaces';
import { renderFormTitle } from '../../../../_shared/ui/utils';
import { FormNames } from '../../data/forms';
import { setActiveForm } from '../../logic';
import styles from './style.module.less';

const width = 250;

const rules: Rules = {};

interface IntermediariosFormPanelProps {
  title: string;
  form: FormInstance<NuevaSolicitudFormState>;
}

export const IntermediariosFormPanel: React.FC<IntermediariosFormPanelProps> = (props) => {
  const dispatch = useAppDispatch();

  const { title, form } = props;

  const nuevaSolicitud = useAppSelector((state: RootState) => state.transferencia.nuevaSolicitud);

  // useEffects

  useEffect(() => {}, []);

  // handlers

  const handleOnFinish = () => {
    /*  dispatch(setEstadoForm({ intermediarios: true })); */
    dispatch(setActiveForm(FormNames.VARIOS));
  };

  // renders

  const loadingContent = false; //ingresarCajas.loading.tiposCaja;

  return (
    <>
      <Form className={styles.form} form={form} layout="vertical" onFinish={handleOnFinish}>
        <Form.Item>{renderFormTitle(title)}</Form.Item>

        <Row wrap={false}>
          <Space size={'middle'}>
            <Col style={{ width: width }}></Col>
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
