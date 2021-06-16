import { unwrapResult } from '@reduxjs/toolkit';
import { Alert, Button, Col, DatePicker, Divider, Form, Input, message, Row, Select, Space, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { ArgsProps } from 'antd/lib/message';
import _ from 'lodash';
import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StateContext } from 'src/app';
import { LoadingContent } from 'src/components/loading';
import { Wrapper } from 'src/components/wrapper';
import { DATE_DD_MM_YYYY_FORMAT, TipoPersona } from 'src/constants';
import { Texts } from 'src/constants/texts';
import { fetchConceptos, fetchCorresponsales, fetchProductos, fetchDatosPersonas, fetchMonedas } from 'src/features/shared';
import { addTransferencia, clearForm, clearState, clearUI, setCuenta, setPersona } from 'src/features/transferencias/nueva-transferencia';
import { NuevaTransferenciaForm, PersonaForm } from 'src/features/transferencias/nueva-transferencia/types';
import { RootState } from 'src/reducers';
import { useAppDispatch } from 'src/store';
import { OpcionEx, Rules } from 'src/types';
import { getFreshToken } from 'src/utils/auth';
import { interpolateString } from 'src/utils/string';
import styles from './style.module.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Link } = Typography;

const width = 250;

const reglas: Rules = {
  cuit: [
    {
      required: true,
      message: 'CUIT no válido',
    },
  ],
  banco: [
    {
      required: true,
      message: 'Banco no válido',
    },
  ],
  cuentaBeneficiario: [
    {
      required: true,
      message: 'Cuenta no válida',
    },
  ],
  nombre: [
    {
      required: true,
      message: 'Nombre o Razón Social no válida',
    },
  ],
  fecha: [
    {
      required: true,
      message: 'Fecha no válida',
    },
  ],
  cuentaOrdenante: [
    {
      required: true,
      message: 'Cuenta no válida',
    },
  ],
  concepto: [
    {
      required: true,
      message: 'Concepto no válido',
    },
  ],
  corresponsal: [
    {
      required: true,
      message: 'Banco Corresponsal no válido',
    },
  ],
  tipoComision: [
    {
      required: true,
      message: 'Tipo de Comisión no válido',
    },
  ],
  moneda: [
    {
      required: true,
      message: 'Moneda no válida',
    },
  ],
  importe: [
    {
      required: true,
      pattern: /^[0-9]+(,[0-9]{1,2})?$/,
      message: 'Importe no válido',
    },
  ],
};

const loadingMessage: ArgsProps = {
  key: 'loading',
  type: 'loading',
  content: 'Cargando...',
  duration: 0,
};

export const NuevaTransferencia: React.FC = (props) => {
  const [transferenciaForm] = useForm<NuevaTransferenciaForm>();
  const [personaForm] = useForm<PersonaForm>();
  const state = useContext(StateContext);
  const dispatch = useAppDispatch();

  const nuevaTransferencia = useSelector((state: RootState) => state.transferencias.nuevaTransferencia);

  // useEffects

  useEffect(() => {
    const fetchData = async () => {
      const token = await getFreshToken(state.msalInstance!);

      dispatch(
        fetchMonedas({
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }),
      );

      dispatch(
        fetchCorresponsales({
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }),
      );

      dispatch(
        fetchConceptos({
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }),
      );

      return () => {
        dispatch(clearState());
      };
    };

    //

    fetchData();
  }, []);

  // handlers

  const loadingContent = false;

  return (
    <Wrapper contentWrapper unselectable direction="column" horizontal="left" style={{ width: loadingContent ? '100%' : 1250 }}>
      {loadingContent ? (
        <LoadingContent />
      ) : (
        <>
          <Row style={{ height: '100%' }}>
            <Col
              style={{
                display: 'flex',
                flex: '1',
                flexDirection: 'column',
                padding: '0 20px',
              }} /* span={layout.formCol.span} offset={layout.formCol.offset} */
            ></Col>
            <Col /* span={2} */ style={{ display: 'flex', justifyContent: 'center' }}>
              <Divider style={{ height: '100%', margin: '0 20px' }} type="vertical" />
            </Col>
            <Col
              style={{ display: 'flex', flex: '1', padding: '0 20px' }} /* span={layout.formCol.span} offset={layout.formCol.offset} */
            ></Col>
          </Row>
        </>
      )}
    </Wrapper>
  );
};
