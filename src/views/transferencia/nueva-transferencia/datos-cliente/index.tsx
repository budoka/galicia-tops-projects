import { unwrapResult } from '@reduxjs/toolkit';
import { Alert, Button, Form, Input, message, Select, Space, Tabs } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import _ from 'lodash';
import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StateContext } from 'src/app';
import { Texts } from 'src/constants/texts';
import { fetchDatosClientes, fetchProductos } from 'src/features/shared';
import { setPersona } from 'src/features/transferencia/nueva-solicitud';
import { ClienteForm } from 'src/features/transferencia/nueva-solicitud/types';
import { RootState } from 'src/reducers';
import { useAppDispatch } from 'src/store';
import { Rules } from 'src/types';
import { interpolateString } from 'src/utils/string';
import { renderFormTitle, renderOptions } from '../utils';
import styles from './style.module.less';

const reglas: Rules = {
  cuit: [
    {
      required: true,
      message: 'CUIT no válido',
    },
  ],
};

export const ClienteFormPanel: React.FC = (props) => {
  const [clienteForm] = useForm<ClienteForm>();
  const state = useContext(StateContext);
  const dispatch = useAppDispatch();

  const nuevaTransferencia = useSelector((state: RootState) => state.transferencias.nuevaSolicitud);

  // useEffects

  useEffect(() => {}, []);

  // handlers

  const handleCuitCliente = () => {
    dispatch(fetchDatosClientes({ query: { filtro: 'CUIT', valor: clienteForm.getFieldsValue().cuit } }))
      .then(unwrapResult)
      .then((personas) => {
        const count = personas.length;
        console.log(count);
        if (count === 1) {
          dispatch(setPersona(personas[0]));
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

  const handleFormularioCliente = () => {};

  // renders

  const renderDatosPersona = () => {
    const persona = nuevaTransferencia.requiredData.persona;

    if (!persona || _.isEmpty(persona)) return undefined;

    const datosPersona = {
      fisica: `${persona.apellido}, ${persona.nombre}`,
      juridica: `${persona.razonSocial}`,
    };

    return <Alert type="success" showIcon style={{ fontWeight: 'bold' }} message={datosPersona[persona.tipo]} />;
  };

  const renderFormularioCliente = () => {
    return (
      <Form className={styles.form} form={clienteForm} name="persona" layout="vertical" onFinish={handleFormularioCliente}>
        <Form.Item> {renderFormTitle('Datos del Ordenante')} </Form.Item>
        <Form.Item>
          <Space size={'middle'}>
            <Form.Item label={Texts.CUIT} name={'cuit'} rules={reglas['cuit']} required>
              <Input disabled={nuevaTransferencia.requiredData.personas?.loading} />
            </Form.Item>
            <Button
              onClick={handleCuitCliente}
              type="primary"
              htmlType="button"
              disabled={nuevaTransferencia.requiredData.personas?.loading}
              loading={nuevaTransferencia.requiredData.personas?.loading}
              style={{ marginTop: 5 }}>
              {nuevaTransferencia.requiredData.personas?.loading ? 'Buscando' : 'Buscar'}
            </Button>
          </Space>
        </Form.Item>

        {nuevaTransferencia.requiredData.persona && (
          <>
            <Form.Item>{renderDatosPersona()}</Form.Item>
            <Form.Item label={Texts.ACCOUNT} name={['ordenante', 'cuenta']} rules={reglas['cuentaOrdenante']} required>
              <Select
                labelInValue
                //optionFilterProp="children"
                // filterOption={(input, option) => option && option.value && option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                placeholder={Texts.SELECT_ACCOUNT}
                loading={nuevaTransferencia.requiredData.cuentas?.loading}
                disabled={nuevaTransferencia.requiredData.cuentas?.loading}

                /* onChange={handleTipoCaja} */
              >
                {renderOptions(
                  nuevaTransferencia.requiredData.cuentas?.values.map((cuenta) => ({
                    key: cuenta.valor,
                    label: cuenta.valor,
                    value: cuenta.valor,
                  })),
                )}
              </Select>
            </Form.Item>
          </>
        )}
      </Form>
    );
  };

  const renderFormularioCuenta = () => {
    return (
      <Form className={styles.form} form={clienteForm} name="nuevaTransferencia" layout="vertical">
        {/*   <Form.Item label={Texts.BANK} name={['ordenante', 'banco']} rules={reglas['banco']} required>
<Input />
</Form.Item> */}
        <Form.Item label={Texts.ACCOUNT} name={['ordenante', 'cuenta']} rules={reglas['cuentaOrdenante']} required>
          <Select
            labelInValue
            //optionFilterProp="children"
            // filterOption={(input, option) => option && option.value && option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            placeholder={Texts.SELECT_ACCOUNT}
            loading={nuevaTransferencia.requiredData.cuentas?.loading}
            disabled={nuevaTransferencia.requiredData.cuentas?.loading}

            /* onChange={handleTipoCaja} */
          >
            {/*               {renderOptions(nuevaTransferencia.requiredData.cuentaProducto?.values?.productos?.cuentas)} */}
          </Select>
        </Form.Item>
      </Form>
    );
  };

  const loadingContent = false; //ingresarCajas.loading.tiposCaja;

  return <>{renderFormularioCliente()}</>;
};
