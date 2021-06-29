import { unwrapResult } from '@reduxjs/toolkit';
import { Alert, Button, Form, Input, message, Space } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/app/store';
import { useAppDispatch } from 'src/app/store/hooks';
import { Texts } from 'src/constants/texts';
import { ClienteForm, DatosOperacion, TransferenciaTabsNames } from 'src/features/transferencia/nueva-solicitud/data/types';
import { fetchCuentas, fetchDatosClientes } from 'src/features/transferencia/shared/logic';
import { Rules } from 'src/types';
import { interpolateString } from 'src/utils/string';
import { getRule, renderFormTitle } from '../../../../shared/ui/utils';
import { setActiveForm, setDatosCliente, setEstadoForm } from '../../logic';
import styles from './style.module.less';

const reglas: Rules = {
  cuit: [
    {
      required: true,
      message: 'CUIT no válido',
    },
  ],
};

interface ClienteFormPanelProps {
  title: string;
  form: FormInstance<ClienteForm>;
}

export const ClienteFormPanel: React.FC<ClienteFormPanelProps> = (props) => {
  const dispatch = useAppDispatch();

  const { title, form } = props;

  const nuevaSolicitud = useSelector((state: RootState) => state.transferencias.nuevaSolicitud);

  // useEffects

  useEffect(() => {
    const currentActiveForm = nuevaSolicitud.ui.form.active;
    const currentStatus = nuevaSolicitud.ui.form.status.datosClientes;
    if (currentActiveForm === TransferenciaTabsNames.DATOS_CLIENTE && currentStatus) {
      const cuit = nuevaSolicitud.data.form?.datosOperacion?.cliente?.cuit;
      form.resetFields();
      form.setFieldsValue({
        cuitCliente: cuit,
      });
    }
  }, [nuevaSolicitud.ui.form.active]);

  // handlers

  const handleCuitCliente = () => {
    dispatch(fetchDatosClientes({ query: { filtro: 'CUIT', valor: form.getFieldsValue().cuitCliente } }))
      .then(unwrapResult)
      .then((clientes) => {
        const count = clientes.length;
        console.log('clientes encontrados: ', count);
        message.success({ key: 'loading', content: Texts.SEARCH_PERSON_OK, duration: 3 });
        /*         if (count === 1) {
          dispatch(setCliente(clientes[0]));
          message.success({ key: 'loading', content: Texts.SEARCH_PERSON_OK, duration: 3 });
        } else {
          message.success({
            key: 'loading',
            content: interpolateString(Texts.SEARCH_PERSON_OK_MULTIPLE_RESULTS, [count]),
            duration: 3,
          });
        } */
      })
      .catch((err) => {
        message.error({ key: 'loading', content: Texts.SEARCH_PERSON_ERROR, duration: 3 });
      });
  };

  const handleOnFinish = () => {
    setData();
    dispatch(setEstadoForm({ datosClientes: true }));
    dispatch(setActiveForm(TransferenciaTabsNames.DATOS_BENEFICIARIO));
  };

  const setData = () => {
    const cliente = nuevaSolicitud.info.clientes?.value[0];
    if (cliente) {
      dispatch(setDatosCliente({ ...cliente, cuit: form.getFieldsValue().cuitCliente }));
      const { hostId } = cliente;
      dispatch(fetchCuentas({ query: { hostId, productos: 'CA,CC' } }));
    }
  };

  // renders

  const renderDatosCliente = () => {
    const cliente = nuevaSolicitud.info.clientes?.value[0];

    if (!cliente) return undefined;

    const nombreCliente = {
      fisica: `${cliente.apellido}, ${cliente.nombre}`,
      juridica: `${cliente.razonSocial}`,
    };

    const documentoPersona = _.first(cliente.documentos.filter((d) => d.tipo === 'CUIT' || d.tipo === 'DU'));

    const datosCliente = (
      <div className={styles.messageClienteWrapper}>
        <span className={styles.messageClienteNombre}>{nombreCliente[cliente.tipo]}</span>
        <span className={styles.messageClienteTipoPersona}>{cliente.tipo.toUpperCase()}</span>
        <span className={styles.messageClienteHostId}>{cliente.hostId} (Host ID)</span>
        <span className={styles.messageClienteDocumento}>
          {+documentoPersona?.numero!} ({documentoPersona?.descripcion})
        </span>
      </div>
    );

    return <Alert type="success" style={{ fontWeight: 'bold' }} message={datosCliente} />;
  };

  const renderFormularioCliente = () => {
    return (
      <Form className={styles.form} form={form} layout="vertical" onFinish={handleOnFinish}>
        <Form.Item> {renderFormTitle(title)} </Form.Item>
        <Form.Item>
          <Space size={'middle'}>
            <Form.Item label={Texts.CUIT} name={'cuitCliente'} rules={getRule(reglas, 'cuit')} required>
              <Input disabled={nuevaSolicitud.info.clientes?.loading} />
            </Form.Item>
            <Button
              onClick={handleCuitCliente}
              type="primary"
              htmlType="button"
              disabled={nuevaSolicitud.info.clientes?.loading}
              loading={nuevaSolicitud.info.clientes?.loading}
              style={{ marginTop: 5 }}>
              {nuevaSolicitud.info.clientes?.loading ? 'Buscando' : 'Buscar'}
            </Button>
          </Space>
        </Form.Item>

        {nuevaSolicitud.info.clientes?.value.length! > 0 && <Form.Item>{renderDatosCliente()}</Form.Item>}

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Confirmar
          </Button>
        </Form.Item>
      </Form>
    );
  };

  return <div className={styles.contentWrapper}>{renderFormularioCliente()}</div>;
};
