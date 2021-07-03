import { CheckCircleFilled } from '@ant-design/icons';
import { unwrapResult } from '@reduxjs/toolkit';
import { message, Tabs } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useContext, useEffect } from 'react';
import { StateContext } from 'src/app';
import { RootState } from 'src/app/store';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import { LoadingContent } from 'src/components/loading';
import { ServiceError } from 'src/components/service-error';
import { Wrapper } from 'src/components/wrapper';
import { SHADOW } from 'src/constants';
import { Texts } from 'src/constants/texts';
import { addSolicitud, cleanState, setActiveForm } from 'src/features/transferencia/nueva-solicitud/logic';
import { DetalleGasto, TipoPersona } from 'src/features/_shared/data/types';
import { fetchMonedas, fetchPaises, fetchCorresponsales, fetchConceptos } from 'src/features/_shared/logic';
import { isFetchingData, hasError } from 'src/helpers/validations';
import { Rules } from 'src/types/interfaces';
import { getFreshToken } from 'src/utils/auth';
import { getViewWidth } from 'src/utils/screen';
import { ClienteForm, BeneficiarioForm, GastosForm, CuentasForm, ImportesForm, FormNames } from '../data/forms';
import { ConfirmacionPanel } from './confirmacion';
import { CuentasFormPanel } from './cuentas';
import { BeneficiarioFormPanel } from './datos-beneficiario';
import { ClienteFormPanel } from './datos-cliente';
import { GastosFormPanel } from './gastos';
import { ImportesFormPanel } from './importes';
import styles from './style.module.less';

const { TabPane } = Tabs;

interface TransferenciaTabs {
  [tab: string]: JSX.Element;
}

export const tiposPersona = [
  { id: 'fisica', descripcion: 'Física' } as { id: TipoPersona; descripcion: string },
  { id: 'juridica', descripcion: 'Jurídica' } as { id: TipoPersona; descripcion: string },
];

export const detallesGastos = [
  { id: 'ben', descripcion: 'BEN' } as { id: DetalleGasto; descripcion: string },
  { id: 'our', descripcion: 'OUR' } as { id: DetalleGasto; descripcion: string },
  { id: 'sha', descripcion: 'SHA' } as { id: DetalleGasto; descripcion: string },
];

export const NuevaSolicitud: React.FC = (props) => {
  const [clienteForm] = useForm<ClienteForm>();
  const [beneficiarioForm] = useForm<BeneficiarioForm>();
  const [gastosForm] = useForm<GastosForm>();
  const [cuentasForm] = useForm<CuentasForm>();
  const [importesForm] = useForm<ImportesForm>();
  const state = useContext(StateContext);
  const dispatch = useAppDispatch();

  const nuevaSolicitud = useAppSelector((state: RootState) => state.transferencia.nuevaSolicitud);
  const shared = useAppSelector((state: RootState) => state.shared);

  /*   useEffect(() => {

  }, [nuevaSolicitud.info]); */

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
    dispatch(addSolicitud({ body: values }))
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

  const isContentLoading = isFetchingData(shared);

  const hasContentError = hasError(shared);

  // renders

  const transferenciaTabs: TransferenciaTabs = {
    cliente: (
      <TabPane
        tab={
          <span className={styles.tabWrapper}>
            <span className={styles.tabLabel}>{FormNames.DATOS_CLIENTE}</span>
            <CheckCircleFilled className={styles.tabIcon} hidden={!nuevaSolicitud.ui.form.status.datosClientes} />
          </span>
        }
        key={FormNames.DATOS_CLIENTE}>
        <ClienteFormPanel title={FormNames.DATOS_CLIENTE} clienteForm={clienteForm} gastosForm={gastosForm} cuentasForm={cuentasForm} />
      </TabPane>
    ),
    beneficiario: (
      <TabPane
        tab={
          <span className={styles.tabWrapper}>
            <span className={styles.tabLabel}>{FormNames.DATOS_BENEFICIARIO}</span>
            <CheckCircleFilled className={styles.tabIcon} hidden={!nuevaSolicitud.ui.form.status.datosBeneficiario} />
          </span>
        }
        key={FormNames.DATOS_BENEFICIARIO}>
        <BeneficiarioFormPanel title={FormNames.DATOS_BENEFICIARIO} form={beneficiarioForm} />
      </TabPane>
    ),
    gastos: (
      <TabPane
        tab={
          <span className={styles.tabWrapper}>
            <span className={styles.tabLabel}>{FormNames.GASTOS}</span>
            <CheckCircleFilled className={styles.tabIcon} hidden={!nuevaSolicitud.ui.form.status.gastos} />
          </span>
        }
        key={FormNames.GASTOS}
        disabled={!nuevaSolicitud.ui.form.status.datosClientes}>
        <GastosFormPanel title={FormNames.GASTOS} form={gastosForm} />
      </TabPane>
    ),
    cuentas: (
      <TabPane
        tab={
          <span className={styles.tabWrapper}>
            <span className={styles.tabLabel}>{FormNames.CUENTAS}</span>
            <CheckCircleFilled className={styles.tabIcon} hidden={!nuevaSolicitud.ui.form.status.cuentas} />
          </span>
        }
        key={FormNames.CUENTAS}
        disabled={!nuevaSolicitud.ui.form.status.datosClientes}>
        <CuentasFormPanel title={FormNames.CUENTAS} form={cuentasForm} />
      </TabPane>
    ),
    importes: (
      <TabPane
        tab={
          <span className={styles.tabWrapper}>
            <span className={styles.tabLabel}>{FormNames.IMPORTES}</span>
            <CheckCircleFilled className={styles.tabIcon} hidden={!nuevaSolicitud.ui.form.status.importes} />
          </span>
        }
        key={FormNames.IMPORTES}>
        <ImportesFormPanel title={FormNames.IMPORTES} form={importesForm} />
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
            <span className={styles.tabLabel}>{FormNames.CONFIRMACION}</span>
          </span>
        }
        disabled={!isConfirmationEnabled()}
        key={FormNames.CONFIRMACION}>
        <ConfirmacionPanel title={FormNames.CONFIRMACION} />
      </TabPane>
    ),
  };

  const renderForm = () => {
    return (
      <>
        <Tabs className={`${styles.tabs} ${SHADOW}`} activeKey={nuevaSolicitud.ui.form.active} tabPosition={'left'} onTabClick={handleTabClick}>
          {Object.values(transferenciaTabs).map((tab) => tab)}
        </Tabs>
      </>
    );
  };

  return (
    <Wrapper
      contentWrapper
      unselectable
      direction="column"
      vertical="top"
      horizontal="center"
      style={{ minWidth: getViewWidth(isContentLoading || hasContentError) }}>
      {isContentLoading ? <LoadingContent /> : hasContentError ? <ServiceError /> : renderForm()}
    </Wrapper>
  );
};
