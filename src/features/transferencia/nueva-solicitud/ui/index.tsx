import { unwrapResult } from '@reduxjs/toolkit';
import { DatePicker, message, Select, Tabs, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { ArgsProps } from 'antd/lib/message';
import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StateContext } from 'src/app';
import { RootState } from 'src/app/store';
import { useAppDispatch } from 'src/app/store/hooks';
import { LoadingContent } from 'src/components/loading';
import { Wrapper } from 'src/components/wrapper';
import { Texts } from 'src/constants/texts';
import { addSolicitud, clearState, setActiveForm } from 'src/features/transferencia/nueva-solicitud/logic';
import {
  BeneficiarioForm,
  ClienteForm,
  DatosOperacion,
  GastosForm,
  NuevaSolicitudExtraState,
  NuevaSolicitudFormState,
  TransferenciaTabsNames,
} from 'src/features/transferencia/nueva-solicitud/data/types';
import { Rules } from 'src/types';
import { getFreshToken } from 'src/utils/auth';
import { getViewWidth } from 'src/utils/screen';
import { BeneficiarioFormPanel } from './datos-beneficiario';
import { ClienteFormPanel } from './datos-cliente';
import { IntermediariosFormPanel } from './datos-intermediario';
import { DetalleGasto, TipoPersona } from 'src/features/shared/data/types';
import { fetchConceptos, fetchCorresponsales, fetchCuentas, fetchMonedas, fetchPaises } from '../../shared/logic';
import { CheckCircleFilled } from '@ant-design/icons';
import styles from './style.module.less';
import { useState } from 'react';
import { ConfirmacionPanel } from './confirmacion';
import { GastoFormPanel } from './gasto';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Link } = Typography;
const { TabPane } = Tabs;

const width = 250;

/* export enum TransferenciaTabsNames {
  DATOS_CLIENTE = 'Datos del Cliente',
  DATOS_BENEFICIARIO = 'Datos del Beneficiario',
  GASTOS = 'Gastos',
  CUENTAS = 'Cuentas',
  INTERMEDIARIO = 'Intermediario',
  VARIOS = 'Varios',
  CONFIRMACION = 'Confirmación',
} */

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

export const tiposPersona = [
  { id: 'fisica', descripcion: 'Física' } as { id: TipoPersona; descripcion: string },
  { id: 'juridica', descripcion: 'Jurídica' } as { id: TipoPersona; descripcion: string },
];

/* export const tiposPersona = [
  { value: 'fisica', label: 'Física' } as { value: TipoPersona; label: string },
  { value: 'juridica', label: 'Jurídica' } as { value: TipoPersona; label: string },
]; */

export const detallesGastos = [
  { id: 'ben', descripcion: 'BEN' } as { id: DetalleGasto; descripcion: string },
  { id: 'our', descripcion: 'OUR' } as { id: DetalleGasto; descripcion: string },
  { id: 'sha', descripcion: 'SHA' } as { id: DetalleGasto; descripcion: string },
];

export const NuevaSolicitud: React.FC = (props) => {
  const [transferenciaForm] = useForm<NuevaSolicitudFormState>();
  const [clienteForm] = useForm<ClienteForm>();
  const [beneficiarioForm] = useForm<BeneficiarioForm>();
  const [gastoForm] = useForm<GastosForm>();
  //  const [currentTab, setCurrentTab] = useState('1');
  const state = useContext(StateContext);
  const dispatch = useAppDispatch();

  const nuevaSolicitud = useSelector((state: RootState) => state.transferencias.nuevaSolicitud);

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
        fetchPaises({
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

  useEffect(() => {
    const persona = nuevaSolicitud.data.form?.datosOperacion?.cliente;
    if (persona) {
      const { hostId } = persona;
      dispatch(fetchCuentas({ query: { hostId, productos: 'CA,CC' } }))
        .then(unwrapResult)
        .then((cuentas) => {
          console.log(cuentas);
          const count = cuentas?.length;
          /*  console.log(count);
          if (count > 1) {
            dispatch(setCuenta(cuentas[0]));
          }*/
        });
    }
  }, [nuevaSolicitud.data.form?.datosOperacion?.cliente]);

  const handleNuevaTransferenciaForm = (values: any) => {
    dispatch(addSolicitud({ data: values }))
      .then(unwrapResult)
      .then(() => {
        message.success({ key: 'loading', content: Texts.TRANSFER_CREATION_OK, duration: 3 });
      })
      .catch((err) => {
        message.error({ key: 'loading', content: Texts.TRANSFER_CREATION_ERROR, duration: 3 });
      });
  };

  const handleReset = () => {
    clienteForm.resetFields();
    transferenciaForm.resetFields();
    /*     dispatch(clearUI());
    dispatch(clearForm()); */
  };

  const handleTabClick = (activeKey: string) => {
    dispatch(setActiveForm(activeKey));
  };

  const isConfirmationEnabled = () => {
    const status = nuevaSolicitud.ui.form.status;
    return Object.values(status).every((s) => {
      //console.log(status, s);
      return s === true;
    });
  };

  // renders

  interface TransferenciaTabs {
    [tab: string]: JSX.Element;
  }

  const transferenciaTabs: TransferenciaTabs = {
    cliente: (
      <TabPane
        tab={
          <span className={styles.tabWrapper}>
            <span className={styles.tabLabel}>{TransferenciaTabsNames.DATOS_CLIENTE}</span>
            <CheckCircleFilled className={styles.tabIcon} hidden={!nuevaSolicitud.ui.form.status.datosClientes} />
          </span>
        }
        key={TransferenciaTabsNames.DATOS_CLIENTE}>
        <ClienteFormPanel title={TransferenciaTabsNames.DATOS_CLIENTE} form={clienteForm} />
      </TabPane>
    ),
    beneficiario: (
      <TabPane
        tab={
          <span className={styles.tabWrapper}>
            <span className={styles.tabLabel}>{TransferenciaTabsNames.DATOS_BENEFICIARIO}</span>
            <CheckCircleFilled className={styles.tabIcon} hidden={!nuevaSolicitud.ui.form.status.datosBeneficiario} />
          </span>
        }
        key={TransferenciaTabsNames.DATOS_BENEFICIARIO}>
        <BeneficiarioFormPanel title={TransferenciaTabsNames.DATOS_BENEFICIARIO} form={beneficiarioForm} />
      </TabPane>
    ),
    gastos: (
      <TabPane
        tab={
          <span className={styles.tabWrapper}>
            <span className={styles.tabLabel}>{TransferenciaTabsNames.GASTOS}</span>
          </span>
        }
        key={TransferenciaTabsNames.GASTOS}>
        <GastoFormPanel title={TransferenciaTabsNames.GASTOS} form={gastoForm} />
      </TabPane>
    ),
    cuentas: (
      <TabPane
        tab={
          <span className={styles.tabWrapper}>
            <span className={styles.tabLabel}>{TransferenciaTabsNames.CUENTAS}</span>
          </span>
        }
        key={TransferenciaTabsNames.CUENTAS}>
        <GastoFormPanel title={TransferenciaTabsNames.CUENTAS} form={gastoForm} />
      </TabPane>
    ),
    intermediarios: (
      <TabPane
        tab={
          <span className={styles.tabWrapper}>
            <span className={styles.tabLabel}>{TransferenciaTabsNames.INTERMEDIARIO}</span>
            <CheckCircleFilled className={styles.tabIcon} hidden={!nuevaSolicitud.ui.form.status.datosIntermediarios} />
          </span>
        }
        key={TransferenciaTabsNames.INTERMEDIARIO}>
        <IntermediariosFormPanel title={TransferenciaTabsNames.GASTOS} form={transferenciaForm} />
      </TabPane>
    ),
    confirmacion: (
      <TabPane
        tab={
          <span className={styles.tabWrapper}>
            <span className={styles.tabLabel}>{TransferenciaTabsNames.CONFIRMACION}</span>
          </span>
        }
        disabled={!isConfirmationEnabled()}
        key={TransferenciaTabsNames.CONFIRMACION}>
        <ConfirmacionPanel title={TransferenciaTabsNames.CONFIRMACION} />
      </TabPane>
    ),
  };

  const Form = () => {
    return (
      <>
        <Tabs className={styles.tabs} activeKey={nuevaSolicitud.ui.form.active} tabPosition={'left'} onTabClick={handleTabClick}>
          {Object.values(transferenciaTabs).map((tab) => tab)}
        </Tabs>
      </>
    );
  };

  const loadingContent = false;

  return (
    <Wrapper
      contentWrapper
      unselectable
      direction="column"
      vertical="top"
      horizontal="left"
      style={{ width: getViewWidth(loadingContent) }}>
      {loadingContent ? <LoadingContent /> : <Form />}
    </Wrapper>
  );
};
