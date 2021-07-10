import { CheckCircleFilled } from '@ant-design/icons';
import { Tabs } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useContext, useEffect } from 'react';
import { StateContext } from 'src/app';
import { RootState } from 'src/app/store';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import { LoadingContent } from 'src/components/loading';
import { ServiceError } from 'src/components/service-error';
import { Wrapper } from 'src/components/wrapper';
import { SHADOW } from 'src/constants';
import { cleanState, setActiveForm } from 'src/features/orden-de-pago/nueva-solicitud/logic';
import { DetalleGasto, TipoPersona } from 'src/features/_shared/data/types';
import { hasError, isFetchingData } from 'src/helpers/validations';
import { getViewWidth } from 'src/utils/screen';
import { ClienteForm, CuentasForm, FormNames, ImporteForm, OrdenanteForm, VariosForm } from '../data/forms';
import { ConfirmacionPanel } from './confirmacion';
import { CuentasFormPanel } from './cuentas';
import { BeneficiarioFormPanel } from './datos-beneficiario';
import { ClienteFormPanel } from './datos-cliente';
import { ImporteFormPanel } from './importes';
import styles from './style.module.less';
import { VariosFormPanel } from './varios';

const { TabPane } = Tabs;

interface OrdenDePagoTabs {
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

export const ODPNuevaSolicitud: React.FC = (props) => {
  const dispatch = useAppDispatch();
  const nuevaSolicitud = useAppSelector((state: RootState) => state.ordenDePago.nuevaSolicitud);
  const shared = useAppSelector((state: RootState) => state.shared);

  const state = useContext(StateContext);
  const [clienteForm] = useForm<ClienteForm>();
  const [ordenanteForm] = useForm<OrdenanteForm>();
  const [cuentasForm] = useForm<CuentasForm>();
  const [importeForm] = useForm<ImporteForm>();
  const [variosForm] = useForm<VariosForm>();

  const isContentLoading = isFetchingData(shared);

  const hasContentError = hasError(shared);

  //#region UseEffects

  useEffect(() => {
    cleanData();
  }, []);

  //#endregion

  //#region Handlers

  const handleOnReset = () => {
    cleanData();
  };

  const handleTabClick = (activeKey: string) => {
    dispatch(setActiveForm(activeKey));
  };

  //#endregion

  //#region Other functions

  const canAdvance = () => {
    const status = nuevaSolicitud.ui.form.status;
    return Object.values(status).every((s) => {
      return s === true;
    });
  };

  const cleanData = () => {
    dispatch(cleanState());
    if (nuevaSolicitud.info.solicitudCreada?.value) {
      clienteForm.resetFields();
      ordenanteForm.resetFields();
      cuentasForm.resetFields();
      importeForm.resetFields();
      variosForm.resetFields();
    }
  };

  //#endregion

  //#region Renders

  const ordenDePago: OrdenDePagoTabs = {
    cliente: (
      <TabPane
        tab={
          <span className={styles.tabWrapper}>
            <span className={styles.tabLabel}>{FormNames.DATOS_CLIENTE}</span>
            <CheckCircleFilled className={styles.tabIcon} hidden={!nuevaSolicitud.ui.form.status.datosClientes} />
          </span>
        }
        key={FormNames.DATOS_CLIENTE}>
        <ClienteFormPanel title={FormNames.DATOS_CLIENTE} clienteForm={clienteForm} variosForm={variosForm} cuentasForm={cuentasForm} />
      </TabPane>
    ),
    ordenante: (
      <TabPane
        tab={
          <span className={styles.tabWrapper}>
            <span className={styles.tabLabel}>{FormNames.DATOS_ORDENANTE}</span>
            <CheckCircleFilled className={styles.tabIcon} hidden={!nuevaSolicitud.ui.form.status.datosOrdenante} />
          </span>
        }
        key={FormNames.DATOS_ORDENANTE}>
        <BeneficiarioFormPanel title={FormNames.DATOS_ORDENANTE} form={ordenanteForm} />
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
            <CheckCircleFilled className={styles.tabIcon} hidden={!nuevaSolicitud.ui.form.status.importe} />
          </span>
        }
        key={FormNames.IMPORTES}>
        <ImporteFormPanel title={FormNames.IMPORTES} form={importeForm} variosForm={variosForm} />
      </TabPane>
    ),
    varios: (
      <TabPane
        tab={
          <span className={styles.tabWrapper}>
            <span className={styles.tabLabel}>{FormNames.VARIOS}</span>
            <CheckCircleFilled className={styles.tabIcon} hidden={!nuevaSolicitud.ui.form.status.varios} />
          </span>
        }
        key={FormNames.VARIOS}
        disabled={!nuevaSolicitud.ui.form.status.importe}>
        <VariosFormPanel title={FormNames.VARIOS} form={variosForm} importeForm={importeForm} />
      </TabPane>
    ),
    confirmacion: (
      <TabPane
        tab={
          <span className={styles.tabWrapper}>
            <span className={styles.tabLabel}>{FormNames.CONFIRMACION}</span>
            <CheckCircleFilled className={styles.tabIcon} hidden={!nuevaSolicitud.info.solicitudCreada?.value} />
          </span>
        }
        disabled={!canAdvance()}
        key={FormNames.CONFIRMACION}>
        <ConfirmacionPanel title={FormNames.CONFIRMACION} handleReset={handleOnReset} />
      </TabPane>
    ),
  };

  const renderForm = () => {
    return (
      <>
        <Tabs className={`${styles.tabs} ${SHADOW}`} activeKey={nuevaSolicitud.ui.form.active} tabPosition={'left'} onTabClick={handleTabClick}>
          {Object.values(ordenDePago).map((tab) => tab)}
        </Tabs>
      </>
    );
  };

  //#endregion

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
