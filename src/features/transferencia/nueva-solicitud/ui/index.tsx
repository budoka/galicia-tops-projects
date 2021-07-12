import { CheckCircleFilled } from '@ant-design/icons';
import { unwrapResult } from '@reduxjs/toolkit';
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
import { Texts } from 'src/constants/texts';
import { addSolicitud, cleanState, setActiveForm } from 'src/features/transferencia/nueva-solicitud/logic';
import { DetalleGastos, TipoCodigoBanco, TipoPersona } from 'src/features/_shared/data/types';
import { hasError, isFetchingData } from 'src/helpers/validations';
import { Message } from 'src/utils/messages';
import { getViewWidth } from 'src/utils/screen';
import { BeneficiarioForm, ClienteForm, CuentasForm, FormNames, ImportesForm, VariosForm } from '../data/forms';
import { ConfirmacionPanel } from './confirmacion';
import { CuentasFormPanel } from './cuentas';
import { BeneficiarioFormPanel } from './datos-beneficiario';
import { ClienteFormPanel } from './datos-cliente';
import { ImportesFormPanel } from './importes';
import styles from './style.module.less';
import { VariosFormPanel } from './varios';

const { TabPane } = Tabs;

interface TransferenciaTabs {
  [tab: string]: JSX.Element;
}

export const tiposPersona = [
  { id: 'fisica', descripcion: 'Física' } as { id: TipoPersona; descripcion: string },
  { id: 'juridica', descripcion: 'Jurídica' } as { id: TipoPersona; descripcion: string },
];

export const detallesGastos = [
  { id: 'ben', descripcion: 'BEN' } as { id: DetalleGastos; descripcion: string },
  { id: 'our', descripcion: 'OUR' } as { id: DetalleGastos; descripcion: string },
  { id: 'sha', descripcion: 'SHA' } as { id: DetalleGastos; descripcion: string },
];

export const tiposCodigoBanco = [
  { id: 'aba', descripcion: 'ABA' } as { id: TipoCodigoBanco; descripcion: string },
  { id: 'swift', descripcion: 'SWIFT' } as { id: TipoCodigoBanco; descripcion: string },
];

export const TXNuevaSolicitud: React.FC = (props) => {
  const dispatch = useAppDispatch();
  const nuevaSolicitud = useAppSelector((state: RootState) => state.transferencia.nuevaSolicitud);
  const shared = useAppSelector((state: RootState) => state.shared);

  const state = useContext(StateContext);
  const [clienteForm] = useForm<ClienteForm>();
  const [beneficiarioForm] = useForm<BeneficiarioForm>();
  const [cuentasForm] = useForm<CuentasForm>();
  const [importesForm] = useForm<ImportesForm>();
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

    clienteForm.resetFields();
    beneficiarioForm.resetFields();
    cuentasForm.resetFields();
    importesForm.resetFields();
    variosForm.resetFields();
  };

  //#endregion

  //#region Renders

  const transferenciaTabs: TransferenciaTabs = {
    cliente: (
      <TabPane
        tab={
          <span className={styles.tabWrapper}>
            <span className={styles.tabLabel}>{FormNames.DATOS_CLIENTE}</span>
            <CheckCircleFilled className={styles.tabIcon} hidden={!nuevaSolicitud.ui.form.status.datosClientes} />
          </span>
        }
        disabled={nuevaSolicitud.info.solicitudCreada?.value}
        key={FormNames.DATOS_CLIENTE}>
        <ClienteFormPanel title={FormNames.DATOS_CLIENTE} clienteForm={clienteForm} variosForm={variosForm} cuentasForm={cuentasForm} />
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
        disabled={nuevaSolicitud.info.solicitudCreada?.value}
        key={FormNames.DATOS_BENEFICIARIO}>
        <BeneficiarioFormPanel title={FormNames.DATOS_BENEFICIARIO} form={beneficiarioForm} />
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
        disabled={!nuevaSolicitud.ui.form.status.datosClientes || nuevaSolicitud.info.solicitudCreada?.value}>
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
        disabled={nuevaSolicitud.info.solicitudCreada?.value}
        key={FormNames.IMPORTES}>
        <ImportesFormPanel title={FormNames.IMPORTES} form={importesForm} />
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
        disabled={nuevaSolicitud.info.solicitudCreada?.value}
        key={FormNames.VARIOS}>
        <VariosFormPanel title={FormNames.VARIOS} form={variosForm} />
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
          {Object.values(transferenciaTabs).map((tab) => tab)}
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
