import { ClearOutlined } from '@ant-design/icons';
import { unwrapResult } from '@reduxjs/toolkit';
import { Alert, Button, Checkbox, Form, Input, message, Space } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { RootState } from 'src/app/store';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import { Texts } from 'src/constants/texts';
import { ClienteForm, CuentasForm, GastosForm, TransferenciaTabsNames } from 'src/features/transferencia/nueva-solicitud/data/types';
import { fetchCuentas, fetchDatosClientes } from 'src/features/transferencia/shared/logic';
import { Rules } from 'src/types';
import { getRule, renderFormTitle } from '../../../../shared/ui/utils';
import { resetCliente, setActiveForm, setDatosCliente, setEstadoForm } from '../../logic';
import styles from './style.module.less';

const reglas: Rules = {
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
  form: FormInstance<ClienteForm>;
  gastosForm: FormInstance<GastosForm>;
  cuentasForm: FormInstance<CuentasForm>;
}

export const ClienteFormPanel: React.FC<ClienteFormPanelProps> = (props) => {
  const dispatch = useAppDispatch();

  const { title, form, gastosForm, cuentasForm } = props;

  const nuevaSolicitud = useAppSelector((state: RootState) => state.transferencias.nuevaSolicitud);

  // useEffects

  useEffect(() => {
    const currentActiveForm = nuevaSolicitud.ui.form.active;
    const currentStatus = nuevaSolicitud.ui.form.status.datosClientes;

    if (currentActiveForm === TransferenciaTabsNames.DATOS_CLIENTE && currentStatus) {
      const cuit = nuevaSolicitud.data.form?.datosOperacion?.cliente?.cuit;
      const vinculadoConBeneficiario = nuevaSolicitud.data.form?.datosOperacion?.vinculadoConBeneficiario;
      console.log(cuit, vinculadoConBeneficiario);
      form.resetFields();
      form.setFieldsValue({
        cuitCliente: cuit,
        vinculadoConBeneficiario,
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

  const handleCleanCuitCliente = () => {
    resetData();
  };

  const handleOnFinish = () => {
    setData();
    if (nuevaSolicitud.ui.form.status.gastos) gastosForm.resetFields();
    if (nuevaSolicitud.ui.form.status.cuentas) cuentasForm.resetFields();
    dispatch(setEstadoForm({ datosClientes: true, gastos: false, cuentas: false }));
    dispatch(setActiveForm(TransferenciaTabsNames.DATOS_BENEFICIARIO));
  };

  const setData = () => {
    const cliente = nuevaSolicitud.info.clientes?.value[0];
    const vinculadoConBeneficiario = form.getFieldsValue().vinculadoConBeneficiario ?? false;

    if (cliente) {
      dispatch(
        setDatosCliente({
          cliente: { ...cliente, cuit: form.getFieldsValue().cuitCliente },
          vinculadoConBeneficiario: vinculadoConBeneficiario,
        }),
      );
      const { hostId } = cliente;
      dispatch(fetchCuentas({ query: { hostId, productos: 'CA,CC' } }));
    }
  };

  const resetData = () => {
    dispatch(resetCliente());
    form.setFieldsValue({
      cuitCliente: '',
      vinculadoConBeneficiario: undefined,
    });

    if (nuevaSolicitud.ui.form.status.gastos) gastosForm.resetFields();
    if (nuevaSolicitud.ui.form.status.cuentas) cuentasForm.resetFields();
    dispatch(setEstadoForm({ datosClientes: false, gastos: false, cuentas: false }));
  };

  // renders

  const renderDatosCliente = () => {
    const cliente = nuevaSolicitud.data.form?.datosOperacion?.cliente || nuevaSolicitud.info.clientes?.value[0];

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
        <Form.Item style={{ marginBottom: 0 }}>
          <Space size={'middle'}>
            <Form.Item label={Texts.CUIT} name={'cuitCliente'} rules={getRule(reglas, 'cuit')} required>
              <Input disabled={nuevaSolicitud.info.clientes?.loading || nuevaSolicitud.info.clientes?.value?.length! > 0} />
            </Form.Item>
            <Button
              onClick={handleCuitCliente}
              type="primary"
              htmlType="button"
              disabled={nuevaSolicitud.info.clientes?.loading || nuevaSolicitud.info.clientes?.value?.length! > 0}
              loading={nuevaSolicitud.info.clientes?.loading}
              style={{ marginTop: 5 }}>
              {nuevaSolicitud.info.clientes?.loading ? 'Buscando' : 'Buscar'}
            </Button>
            <Button
              onClick={handleCleanCuitCliente}
              type="default"
              htmlType="button"
              disabled={nuevaSolicitud.info.clientes?.loading}
              style={{ marginTop: 5 }}>
              <ClearOutlined />
            </Button>
          </Space>
        </Form.Item>

        {nuevaSolicitud.info.clientes?.value.length! > 0 && (
          <>
            <Form.Item style={{ width: 323 }}>{renderDatosCliente()}</Form.Item>
            <Form.Item
              /*   label={Texts.LINKED_BENEFICIARY} */
              name={'vinculadoConBeneficiario'}
              rules={getRule(reglas, 'vinculadoConBeneficiario')}
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
