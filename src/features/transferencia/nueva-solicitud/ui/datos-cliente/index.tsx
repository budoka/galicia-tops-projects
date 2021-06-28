import { unwrapResult } from '@reduxjs/toolkit';
import { Alert, Button, Form, Input, message, Space } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/app/store';
import { useAppDispatch } from 'src/app/store/hooks';
import { Texts } from 'src/constants/texts';
import { ClienteForm, DatosOperacion } from 'src/features/transferencia/nueva-solicitud/data/types';
import { fetchDatosClientes } from 'src/features/transferencia/shared/logic';
import { Rules } from 'src/types';
import { interpolateString } from 'src/utils/string';
import { renderFormTitle } from '../../../../shared/ui/utils';
import { setCliente, setClienteForm } from '../../logic';
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
  form: FormInstance<ClienteForm>;
}

export const ClienteFormPanel: React.FC<ClienteFormPanelProps> = (props) => {
  const dispatch = useAppDispatch();

  const { form } = props;

  const nuevaSolicitud = useSelector((state: RootState) => state.transferencias.nuevaSolicitud);

  // useEffects

  useEffect(() => {}, []);

  // handlers

  const handleCuitCliente = () => {
    dispatch(fetchDatosClientes({ query: { filtro: 'CUIT', valor: form.getFieldsValue().cuitCliente } }))
      .then(unwrapResult)
      .then((clientes) => {
        const count = clientes.length;
        console.log('clientes encontrados: ', count);
        if (count === 1) {
          dispatch(setCliente(clientes[0]));
          message.success({ key: 'loading', content: Texts.SEARCH_PERSON_OK, duration: 3 });
        } else {
          message.success({
            key: 'loading',
            content: interpolateString(Texts.SEARCH_PERSON_OK_MULTIPLE_RESULTS, [count]),
            duration: 3,
          });
        }
      })
      .catch((err) => {
        message.error({ key: 'loading', content: Texts.SEARCH_PERSON_ERROR, duration: 3 });
      });
  };

  const handleFormularioCliente = () => {
    if (nuevaSolicitud.data.extra?.cliente && !nuevaSolicitud.data.form?.datosOperacion.completed) dispatch(setClienteForm(true));
  };

  // renders

  const renderDatosPersona = () => {
    const persona = nuevaSolicitud.data.extra?.cliente;

    if (!persona || _.isEmpty(persona)) return undefined;

    const datosPersona = {
      fisica: `${persona.apellido}, ${persona.nombre}`,
      juridica: `${persona.razonSocial}`,
    };

    return <Alert type="success" showIcon style={{ fontWeight: 'bold' }} message={datosPersona[persona.tipo]} />;
  };

  const renderFormularioCliente = () => {
    return (
      <Form className={styles.form} form={form} name="cliente" layout="vertical" onFinish={handleFormularioCliente}>
        <Form.Item> {renderFormTitle('Datos del Cliente')} </Form.Item>
        <Form.Item>
          <Space size={'middle'}>
            <Form.Item label={Texts.CUIT} name={['cuitCliente']} rules={reglas['cuit']} required>
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

        {nuevaSolicitud.data.extra?.cliente && (
          <>
            <Form.Item>{renderDatosPersona()}</Form.Item>
            {/*    <Form.Item label={Texts.ACCOUNT} name={['ordenante', 'cuenta']} rules={reglas['cuentaOrdenante']} required>
              <Select
                labelInValue
                //optionFilterProp="children"
                // filterOption={(input, option) => option && option.value && option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                placeholder={Texts.SELECT_ACCOUNT}
                loading={nuevaSolicitud.info.cuentas?.loading}
                disabled={nuevaSolicitud.info.cuentas?.loading}

               //onChange={handleTipoCaja} 
              >
                {renderOptions(nuevaSolicitud.info.cuentas?.value!, 'cuenta')}
              </Select>
            </Form.Item> */}
          </>
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            /*    disabled={nuevaSolicitud.info.clientes?.loading} */
            style={{ marginTop: 5 }}>
            Siguiente
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const loadingContent = false; //ingresarCajas.loading.tiposCaja;

  return <>{renderFormularioCliente()}</>;
};
