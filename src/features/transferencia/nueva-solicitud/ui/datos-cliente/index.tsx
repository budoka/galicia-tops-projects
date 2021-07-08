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
import { ClienteForm, CuentasForm, FormNames, GastosForm } from '../../data/forms';
import { resetCliente, setActiveForm, setDatosCliente, setEstadoForm } from '../../logic';
import styles from './style.module.less';

const rules: Rules = {
  cuit: [
    {
      required: true,
      message: 'CUIT no válido',
    },
  ],
  vinculadoConBeneficiario: [
    {
      required: false,
      message: 'Campo no válido',
    },
  ],
};

interface ClienteFormPanelProps {
  title: string;
  clienteForm: FormInstance<ClienteForm>;
  gastosForm: FormInstance<GastosForm>;
  cuentasForm: FormInstance<CuentasForm>;
}

export const ClienteFormPanel: React.FC<ClienteFormPanelProps> = (props) => {
  const dispatch = useAppDispatch();

  const { title, clienteForm, gastosForm, cuentasForm } = props;

  const nuevaSolicitud = useAppSelector((state: RootState) => state.transferencia.nuevaSolicitud);

  // useEffects

  useEffect(() => {
    const currentActiveForm = nuevaSolicitud.ui.form.active;
    const currentStatus = nuevaSolicitud.ui.form.status.datosClientes;

    if (currentActiveForm === FormNames.DATOS_CLIENTE && currentStatus) {
      const cuit = nuevaSolicitud.data.form?.datosOperacion?.cliente?.cuit;
      const vinculadoConBeneficiario = nuevaSolicitud.data.form?.normativas?.vinculadoConBeneficiario;

      clienteForm.resetFields();
      clienteForm.setFieldsValue({
        cuitCliente: cuit,
        vinculadoConBeneficiario,
      });
    }
  }, [nuevaSolicitud.ui.form.active]);

  // handlers

  const handleCuitCliente = () => {
    fetchCliente();
  };

  const handleCleanCuitCliente = () => {
    resetData();
  };

  const handleOnFinish = () => {
    setClientData();
  };

  // other functions

  const fetchCliente = () => {
    clienteForm
      .validateFields()
      .then(() => {
        Message.loading(Texts.SEARCH_CLIENT_LOADING);

        dispatch(fetchDatosClientes({ query: { filtro: 'CUIT', valor: clienteForm.getFieldsValue().cuitCliente } }))
          .then(unwrapResult)
          .then((a) => Message.success(Texts.SEARCH_CLIENT_OK))
          .catch((err) => Message.error(Texts.SEARCH_CLIENT_ERROR));
      })
      .catch(() => {});
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
    const vinculadoConBeneficiario = clienteForm.getFieldsValue().vinculadoConBeneficiario ?? false;

    if (cliente) {
      await fetchCuentasCliente(cliente.hostId)
        .then(() => {
          console.log('ok');
          dispatch(
            setDatosCliente({
              cliente: { ...cliente, cuit: clienteForm.getFieldsValue().cuitCliente },
              vinculadoConBeneficiario: vinculadoConBeneficiario,
            }),
          );

          if (nuevaSolicitud.ui.form.status.gastos) gastosForm.resetFields();
          if (nuevaSolicitud.ui.form.status.cuentas) cuentasForm.resetFields();

          dispatch(setEstadoForm({ datosClientes: true, gastos: false, cuentas: false }));
          dispatch(setActiveForm(FormNames.DATOS_BENEFICIARIO));
        })
        .catch((err) => {
          console.log('error');
        });
    }
  };

  const resetData = () => {
    dispatch(resetCliente());

    clienteForm.setFieldsValue({
      cuitCliente: '',
      vinculadoConBeneficiario: undefined,
    });

    if (nuevaSolicitud.ui.form.status.gastos) gastosForm.resetFields();
    if (nuevaSolicitud.ui.form.status.cuentas) cuentasForm.resetFields();

    dispatch(setEstadoForm({ datosClientes: false, gastos: false, cuentas: false }));
  };

  // renders

  const renderDatosCliente = () => {
    const cliente = nuevaSolicitud.data.form?.datosOperacion?.cliente || nuevaSolicitud.info.clientes?.value![0];

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
        <Form.Item> {renderFormTitle(title)} </Form.Item>
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
            <Form.Item
              /*   label={Texts.LINKED_BENEFICIARY} */
              name={'vinculadoConBeneficiario'}
              rules={getRule(rules, 'vinculadoConBeneficiario')}
              valuePropName="checked">
              <Checkbox>{Texts.LINKED_BENEFICIARY}</Checkbox>
            </Form.Item>
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

  return <div className={styles.contentWrapper}>{renderFormularioCliente()}</div>;
};
