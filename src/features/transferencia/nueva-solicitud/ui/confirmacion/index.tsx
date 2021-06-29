import { Button, Col, DatePicker, Descriptions, Form, Input, Row, Select, Space, Tabs, Typography } from 'antd';
import { FormInstance, useForm } from 'antd/lib/form/Form';
import { ArgsProps } from 'antd/lib/message';
import _ from 'lodash';
import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StateContext } from 'src/app';
import { RootState } from 'src/app/store';
import { useAppDispatch } from 'src/app/store/hooks';
import { DATE_DD_MM_YYYY_FORMAT } from 'src/constants';
import { Texts } from 'src/constants/texts';
import { DetalleGasto } from 'src/features/shared/data/types';
import { NuevaSolicitudFormState } from 'src/features/transferencia/nueva-solicitud/data/types';
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

interface ConfirmacionPanelProps {
  title: string;
  //form: FormInstance<NuevaSolicitudFormState>;
}

export const ConfirmacionPanel: React.FC<ConfirmacionPanelProps> = (props) => {
  const dispatch = useAppDispatch();

  const { title } = props;

  const nuevaSolicitud = useSelector((state: RootState) => state.transferencias.nuevaSolicitud);

  // useEffects

  useEffect(() => {}, []);

  // handlers

  const handleOnFinish = () => {
    if (nuevaSolicitud.data.form?.datosOperacion?.cliente && !nuevaSolicitud.ui.form.status.datosClientes) {
      // ok
    }
  };

  // renders

  const loadingContent = false; //ingresarCajas.loading.tiposCaja;

  const renderDatosCliente = () => {
    const cliente = nuevaSolicitud.data.form?.datosOperacion?.cliente!;

    const nombreCliente = {
      fisica: `${cliente.apellido}, ${cliente.nombre}`,
      juridica: `${cliente.razonSocial}`,
    };

    // const documentoCliente = _.first(cliente.documentos.filter((d) => d.tipo === 'CUIT' || d.tipo === 'DU'));

    return (
      <Descriptions title="Datos del Cliente" size="small" bordered>
        <Descriptions.Item label="Nombre / Razón Social" span={2}>
          {nombreCliente[cliente.tipo]}
        </Descriptions.Item>
        <Descriptions.Item label="CUIT">{cliente.cuit}</Descriptions.Item>
        {/*      <Descriptions.Item label={documentoCliente?.descripcion}>{+documentoCliente?.numero!}</Descriptions.Item> */}
      </Descriptions>
    );
  };

  const renderDatosBeneficiario = () => {
    const beneficiario = nuevaSolicitud.data.form?.datosOperacion?.beneficiario;

    return (
      <Descriptions title="Datos del Beneficiario" size="small" bordered>
        <Descriptions.Item label="Tipo de Persona">{beneficiario?.tipoPersona}</Descriptions.Item>
        <Descriptions.Item label="Nombre / Razón Social" span={2}>
          {beneficiario?.razonSocial ?? `${beneficiario?.apellido}, ${beneficiario?.nombre}`}
        </Descriptions.Item>
      </Descriptions>
    );
  };

  return (
    <>
      <Space size={'middle'} wrap={true} direction="vertical">
        <Row>
          <Text>{renderFormTitle(title)}</Text>
        </Row>
        <Row>{renderDatosCliente()}</Row>
        <Row>{renderDatosBeneficiario()}</Row>
      </Space>

      <Form.Item style={{ position: 'sticky', top: 550 }} /* {...tailLayout} */>
        <Space>
          <Button type="primary" htmlType="submit">
            Confirmar
          </Button>
        </Space>
      </Form.Item>
    </>
  );
};
