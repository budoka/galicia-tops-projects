import { CheckCircleFilled } from '@ant-design/icons';
import { unwrapResult } from '@reduxjs/toolkit';
import { DatePicker, message, Select, Tabs, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { ArgsProps } from 'antd/lib/message';
import React, { useContext, useEffect } from 'react';
import { StateContext } from 'src/app';
import { RootState } from 'src/app/store';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import { LoadingContent } from 'src/components/loading';
import { Wrapper } from 'src/components/wrapper';
import { SHADOW } from 'src/constants';
import { Texts } from 'src/constants/texts';
import { DetalleGasto, TipoPersona } from 'src/features/shared/data/types';
import {
  BeneficiarioForm,
  ClienteForm,
  CuentasForm,
  GastosForm,
  ImportesForm,
  TransferenciaTabsNames,
} from 'src/features/transferencia/nueva-solicitud/data/types';
import { addSolicitud, cleanState, setActiveForm } from 'src/features/transferencia/nueva-solicitud/logic';
import { Rules } from 'src/types';
import { getFreshToken } from 'src/utils/auth';
import { getViewWidth } from 'src/utils/screen';
import { fetchConceptos, fetchCorresponsales, fetchMonedas, fetchPaises } from '../../shared/logic';
import { ConfirmacionPanel } from './confirmacion';
import { CuentasFormPanel } from './cuentas';
import { BeneficiarioFormPanel } from './datos-beneficiario';
import { ClienteFormPanel } from './datos-cliente';
import { GastosFormPanel } from './gastos';
import { ImportesFormPanel } from './importes';
import styles from './style.module.less';
import { VariosFormPanel } from './varios';

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
  /*  const [transferenciaForm] = useForm<NuevaSolicitudFormState>(); */
  const [clienteForm] = useForm<ClienteForm>();
  const [beneficiarioForm] = useForm<BeneficiarioForm>();
  const [gastosForm] = useForm<GastosForm>();
  const [cuentasForm] = useForm<CuentasForm>();
  const [importesForm] = useForm<ImportesForm>();
  const state = useContext(StateContext);
  const dispatch = useAppDispatch();

  const nuevaSolicitud = useAppSelector((state: RootState) => state.transferencias.nuevaSolicitud);

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
        dispatch(cleanState());
      };
    };

    fetchData();
  }, []);

  // handlers

  /*   useEffect(() => {
    const persona = nuevaSolicitud.data.form?.datosOperacion?.cliente;
    if (persona) {
      const { hostId } = persona;
      dispatch(fetchCuentas({ query: { hostId, productos: 'CA,CC' } }))
        .then(unwrapResult)
        .then((cuentas) => {
          console.log(cuentas);
          const count = cuentas?.length;
          // console.log(count);
        //  if (count > 1) {
        //    dispatch(setCuenta(cuentas[0]));
       //   }
        });
    }
  }, [nuevaSolicitud.data.form?.datosOperacion?.cliente]); */

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
    //   clienteForm.resetFields();
    //  transferenciaForm.resetFields();
    /*     dispatch(clearUI());
    dispatch(clearForm()); */
  };

  const handleTabClick = (activeKey: string) => {
    dispatch(setActiveForm(activeKey));
  };

  const isConfirmationEnabled = () => {
    const status = nuevaSolicitud.ui.form.status;
    return Object.values(status).every((s) => {
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
        <ClienteFormPanel
          title={TransferenciaTabsNames.DATOS_CLIENTE}
          form={clienteForm}
          gastosForm={gastosForm}
          cuentasForm={cuentasForm}
        />
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
            <CheckCircleFilled className={styles.tabIcon} hidden={!nuevaSolicitud.ui.form.status.gastos} />
          </span>
        }
        key={TransferenciaTabsNames.GASTOS}>
        <GastosFormPanel title={TransferenciaTabsNames.GASTOS} form={gastosForm} />
      </TabPane>
    ),
    cuentas: (
      <TabPane
        tab={
          <span className={styles.tabWrapper}>
            <span className={styles.tabLabel}>{TransferenciaTabsNames.CUENTAS}</span>
            <CheckCircleFilled className={styles.tabIcon} hidden={!nuevaSolicitud.ui.form.status.cuentas} />
          </span>
        }
        key={TransferenciaTabsNames.CUENTAS}>
        <CuentasFormPanel title={TransferenciaTabsNames.CUENTAS} form={cuentasForm} />
      </TabPane>
    ),
    importes: (
      <TabPane
        tab={
          <span className={styles.tabWrapper}>
            <span className={styles.tabLabel}>{TransferenciaTabsNames.IMPORTES}</span>
            <CheckCircleFilled className={styles.tabIcon} hidden={!nuevaSolicitud.ui.form.status.importes} />
          </span>
        }
        key={TransferenciaTabsNames.IMPORTES}>
        <ImportesFormPanel title={TransferenciaTabsNames.IMPORTES} form={importesForm} />
      </TabPane>
    ),
    /*     varios: (
      <TabPane
        tab={
          <span className={styles.tabWrapper}>
            <span className={styles.tabLabel}>{TransferenciaTabsNames.VARIOS}</span>
            <CheckCircleFilled className={styles.tabIcon} hidden={!nuevaSolicitud.ui.form.status.varios} />
          </span>
        }
        key={TransferenciaTabsNames.VARIOS}>
        <VariosFormPanel title={TransferenciaTabsNames.VARIOS} form={transferenciaForm} />
      </TabPane>
    ), */
    /*     intermediarios: (
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
    ), */
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

  const renderForm = () => {
    return (
      <>
        <Tabs
          className={`${styles.tabs} ${SHADOW}`}
          activeKey={nuevaSolicitud.ui.form.active}
          tabPosition={'left'}
          onTabClick={handleTabClick}>
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
      horizontal="center"
      style={{ minWidth: getViewWidth(loadingContent) }}>
      {loadingContent ? <LoadingContent /> : renderForm()}
    </Wrapper>
  );
};
