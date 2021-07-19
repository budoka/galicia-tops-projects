import { ClearOutlined } from '@ant-design/icons';
import { unwrapResult } from '@reduxjs/toolkit';
import { Alert, Button, Checkbox, Form, Input, Space } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { RootState } from 'src/app/store';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import { Texts } from 'src/constants/texts';
import { fetchCuentas, fetchDatosClientes } from 'src/features/_shared/logic';
import { Rules } from 'src/types/interfaces';
import { Message } from 'src/utils/messages';
import { getRule, renderFormTitle } from '../../../../_shared/ui/utils';
import { ClienteForm, CuentasForm, FormNames, VariosForm } from '../../data/forms';
import { resetCliente, setActiveForm, setDatosCliente, setEstadoForm } from '../../logic';
import styles from './style.module.less';

const rules: Rules = {
  cuit: [
    {
      required: true,
      message: 'CUIT no válido',
    },
  ],
};

interface ClienteFormPanelProps {
  title: string;
  clienteForm: FormInstance<ClienteForm>;
  cuentasForm: FormInstance<CuentasForm>;
  variosForm: FormInstance<VariosForm>;
}

export const ClienteFormPanel: React.FC<ClienteFormPanelProps> = (props) => {
  const { title, clienteForm, variosForm, cuentasForm } = props;

  const dispatch = useAppDispatch();
  const nuevaSolicitud = useAppSelector((state: RootState) => state.ordenDePago.nuevaSolicitud);

  //#region UseEffects

  useEffect(() => {
    const currentActiveForm = nuevaSolicitud.ui.form.active;
    const currentStatus = nuevaSolicitud.ui.form.status.datosClientes;

    if (currentActiveForm === FormNames.DATOS_CLIENTE && currentStatus) {
      const cuit = nuevaSolicitud.data.form?.detalles?.cliente?.cuit;

      clienteForm.resetFields();
      clienteForm.setFieldsValue({
        cuitCliente: cuit,
      });
    }
  }, [nuevaSolicitud.ui.form.active]);

  //#endregion

  //#region Handlers

  const handleCuitCliente = () => {
    fetchCliente();
  };

  const handleCleanCuitCliente = () => {
    resetData();
  };

  const handleOnFinish = () => {
    setClientData();
  };

  //#endregion

  //#region Other functions

  const fetchCliente = () => {
    clienteForm
      .validateFields()
      .then(async () => {
        Message.loading(Texts.SEARCH_CLIENT_LOADING);

        const result = await dispatch(fetchDatosClientes({ query: { filtro: 'CUIT', valor: clienteForm.getFieldsValue().cuitCliente } }));

        if (fetchDatosClientes.fulfilled.match(result)) {
          Message.success(Texts.SEARCH_CLIENT_OK);
        } else {
          Message.error(Texts.SEARCH_CLIENT_ERROR);
        }
      })
      .catch(() => {
        /* Error al validar. No requiere acción. */
      });
  };

  const fetchCuentasCliente = async (hostId: string, productos: string = 'CA,CC') =>
    new Promise<void>(async (resolve, reject) => {
      Message.loading(Texts.SEARCH_ACCOUNTS_LOADING);

      const result = await dispatch(fetchCuentas({ query: { hostId, productos } }));

      if (fetchCuentas.fulfilled.match(result)) {
        Message.success(Texts.SEARCH_ACCOUNTS_OK);
        resolve();
      } else {
        Message.error(Texts.SEARCH_ACCOUNTS_ERROR);
        reject();
      }
    });

  const setClientData = async () => {
    const cliente = nuevaSolicitud.info.clientes?.value![0];

    if (cliente) {
      await fetchCuentasCliente(cliente.hostId)
        .then(() => {
          dispatch(
            setDatosCliente({
              cliente: { ...cliente, cuit: clienteForm.getFieldsValue().cuitCliente },
            }),
          );

          resetForms();

          dispatch(setEstadoForm({ datosClientes: true, cuentas: false }));
          dispatch(setActiveForm(FormNames.DATOS_ORDENANTE));
        })
        .catch((err) => {});
    }
  };

  const resetData = () => {
    dispatch(resetCliente());

    clienteForm.setFieldsValue({
      cuitCliente: '',
    });

    resetForms();

    dispatch(setEstadoForm({ datosClientes: false, cuentas: false }));
  };

  const resetForms = () => {
    if (nuevaSolicitud.ui.form.status.varios) variosForm.resetFields();
    if (nuevaSolicitud.ui.form.status.cuentas) cuentasForm.resetFields();
  };

  //#endregion

  //#region Renders

  const renderDatosCliente = () => {
    const cliente = nuevaSolicitud.data.form?.detalles?.cliente || nuevaSolicitud.info.clientes?.value![0];

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
      <Form className={styles.form} form={clienteForm} layout="vertical" onFinish={handleOnFinish}>
        <Form.Item>{renderFormTitle(title)}</Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Space size={'middle'}>
            <Form.Item label={Texts.CUIT} name={'cuitCliente'} rules={getRule(rules, 'cuit')} required>
              <Input disabled={nuevaSolicitud.info.clientes?.loading || nuevaSolicitud.info.clientes?.value?.length! > 0} />
            </Form.Item>
            <Button
              onClick={handleCuitCliente}
              type="primary"
              htmlType="button"
              disabled={nuevaSolicitud.info.clientes?.loading || nuevaSolicitud.info.clientes?.value?.length! > 0}
              //loading={nuevaSolicitud.info.clientes?.loading}
              style={{ marginTop: 5 }}>
              Buscar
            </Button>
            <Button onClick={handleCleanCuitCliente} type="default" htmlType="button" disabled={nuevaSolicitud.info.clientes?.loading} style={{ marginTop: 5 }}>
              <ClearOutlined />
            </Button>
          </Space>
        </Form.Item>

        {nuevaSolicitud.info.clientes?.value?.length! > 0 && (
          <>
            <Form.Item style={{ width: 323 }}>{renderDatosCliente()}</Form.Item>
          </>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={!(nuevaSolicitud.info.clientes?.value?.length! > 0)}>
            Confirmar
          </Button>
        </Form.Item>
      </Form>
    );
  };

  //#endregion

  return <div className={styles.contentWrapper}>{renderFormularioCliente()}</div>;
};
