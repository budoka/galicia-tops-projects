import { Button, Col, DatePicker, Form, Input, Row, Select, Space, Tabs, Typography } from 'antd';
import { FormInstance, useForm } from 'antd/lib/form/Form';
import { ArgsProps } from 'antd/lib/message';
import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StateContext } from 'src/app';
import { RootState } from 'src/app/store';
import { useAppDispatch } from 'src/app/store/hooks';
import { DATE_DD_MM_YYYY_FORMAT } from 'src/constants';
import { Texts } from 'src/constants/texts';
import { DetalleGasto } from 'src/features/shared/data/types';
import { NuevaSolicitudFormState, TransferenciaTabsNames } from 'src/features/transferencia/nueva-solicitud/data/types';
import { Rules } from 'src/types';
import { getRule, renderFormTitle, renderOptions } from '../../../../shared/ui/utils';
import { setActiveForm, setEstadoForm } from '../../logic';
import styles from './style.module.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Link } = Typography;
const { TabPane } = Tabs;

const width = 250;

const reglas: Rules = {};

const loadingMessage: ArgsProps = {
  key: 'loading',
  type: 'loading',
  content: 'Cargando...',
  duration: 0,
};

interface IntermediariosFormPanelProps {
  title: string;
  form: FormInstance<NuevaSolicitudFormState>;
}

export const IntermediariosFormPanel: React.FC<IntermediariosFormPanelProps> = (props) => {
  const dispatch = useAppDispatch();

  const { title, form } = props;

  const nuevaSolicitud = useSelector((state: RootState) => state.transferencias.nuevaSolicitud);

  // useEffects

  useEffect(() => {}, []);

  // handlers

  const handleOnFinish = () => {
    dispatch(setEstadoForm({ datosIntermediarios: true }));
    dispatch(setActiveForm(TransferenciaTabsNames.VARIOS));
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
