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
import { cleanState, setActiveForm } from 'src/features/orden-de-pago/nueva-instruccion/logic';
import { hasError, isFetchingData } from 'src/helpers/validations';
import { getViewWidth } from 'src/utils/screen';
import { FormNames, InstruccionForm, SolicitudForm } from '../data/forms';
import { ConfirmacionPanel } from './confirmacion';
import { InstruccionFormPanel } from './instruccion';
import styles from './style.module.less';

const { TabPane } = Tabs;

interface OrdenDePagoTabs {
  [tab: string]: JSX.Element;
}

export const ODPNuevaInstruccion: React.FC = (props) => {
  const dispatch = useAppDispatch();
  const nuevaInstruccion = useAppSelector((state: RootState) => state.ordenDePago.nuevaInstruccion);
  const shared = useAppSelector((state: RootState) => state.shared);

  const state = useContext(StateContext);
  const [solicitudForm] = useForm<SolicitudForm>();
  const [instruccionForm] = useForm<InstruccionForm>();

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
    const status = nuevaInstruccion.ui.form.status;
    return Object.values(status).every((s) => {
      return s === true;
    });
  };

  const cleanData = () => {
    dispatch(cleanState());

    solicitudForm.resetFields();
    instruccionForm.resetFields();
  };

  //#endregion

  //#region Renders

  const ordenDePago: OrdenDePagoTabs = {
    instruccion: (
      <TabPane
        tab={
          <span className={styles.tabWrapper}>
            <span className={styles.tabLabel}>{FormNames.INSTRUCCION}</span>
            <CheckCircleFilled className={styles.tabIcon} hidden={!nuevaInstruccion.ui.form.status.instruccion} />
          </span>
        }
        disabled={nuevaInstruccion.info.instruccionCreada?.value}
        key={FormNames.INSTRUCCION}>
        <InstruccionFormPanel title={FormNames.INSTRUCCION} solicitudForm={solicitudForm} instruccionForm={instruccionForm} />
      </TabPane>
    ),
    confirmacion: (
      <TabPane
        tab={
          <span className={styles.tabWrapper}>
            <span className={styles.tabLabel}>{FormNames.CONFIRMACION}</span>
            <CheckCircleFilled className={styles.tabIcon} hidden={!nuevaInstruccion.info.instruccionCreada?.value} />
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
        <Tabs className={`${styles.tabs} ${SHADOW}`} activeKey={nuevaInstruccion.ui.form.active} tabPosition={'left'} onTabClick={handleTabClick}>
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
