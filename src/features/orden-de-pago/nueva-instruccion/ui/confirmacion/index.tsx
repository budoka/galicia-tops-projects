import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Descriptions, Modal, Row, Space, Typography } from 'antd';
import React, { useContext, useEffect } from 'react';
import { StateContext } from 'src/app';
import { RootState } from 'src/app/store';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import { Texts } from 'src/constants/texts';
import { getFreshToken } from 'src/utils/auth';
import { formatCurrencyAmount, formatDate } from 'src/utils/formatters';
import { sumAmounts } from 'src/utils/maths';
import { Message } from 'src/utils/messages';
import { renderFormTitle } from '../../../../_shared/ui/utils';
import { NuevaInstruccionDataState } from '../../data/interfaces';
import { addInstruccion } from '../../logic';

const { Text } = Typography;
const { confirm } = Modal;

const width = 250;

interface ConfirmacionPanelProps {
  title: string;
  handleReset: () => void;
}

export const ConfirmacionPanel: React.FC<ConfirmacionPanelProps> = (props) => {
  const { title, handleReset } = props;

  const state = useContext(StateContext);

  const dispatch = useAppDispatch();
  const nuevaInstruccion = useAppSelector((state: RootState) => state.ordenDePago.nuevaInstruccion);

  //#region UseEffects

  useEffect(() => {}, []);

  //#endregion

  //#region Handlers

  const handleOnConfirm = async () => {
    const token = await getFreshToken(state.msalInstance!);

    if (canConfirm()) {
      Message.loading(Texts.INSTRUCTION_CREATION_LOADING);

      const result = await dispatch(
        addInstruccion({
          headers: {
            Authorization: 'Bearer ' + token,
          },
          body: nuevaInstruccion.data as NuevaInstruccionDataState,
        }),
      );

      if (addInstruccion.fulfilled.match(result)) {
        Message.success(Texts.INSTRUCTION_CREATION_OK);
      } else {
        Message.error(Texts.INSTRUCTION_CREATION_ERROR);
      }
    }
  };

  const handleOnReset = () => {
    handleReset();
  };

  //#endregion

  //#region Other functions

  const canConfirm = () => {
    const status = nuevaInstruccion.ui.form.status;
    return Object.values(status).every((s) => {
      return s === true;
    });
  };

  const showConfirm = () =>
    confirm({
      title: 'Cancelar Instrucción',
      icon: <ExclamationCircleOutlined />,
      content: '¿Desea cancelar la instrucción y volver a crear otra? (Se perderán todos los datos cargados)',
      okText: 'Confirmar',
      cancelText: 'Cancelar',
      onOk() {
        handleOnReset();
      },
      onCancel() {},
    });

  //#endregion

  //#region Renders

  const renderDatosSolicitud = () => {
    const { numeroOperacion, importe, moneda, cuenta, cliente } = nuevaInstruccion.info.solicitud?.value || {};

    return (
      <>
        <Row>{renderFormTitle('Solicitud', 16)}</Row>
        <Descriptions size="small" bordered>
          <Descriptions.Item label="Número de Operación">{numeroOperacion}</Descriptions.Item>
          <Descriptions.Item label="Importe Total">{formatCurrencyAmount(importe!, moneda?.id)}</Descriptions.Item>
          <Descriptions.Item label="Cuenta">{cuenta}</Descriptions.Item>
          <Descriptions.Item label="Nombre / Razón Social Cliente" span={2}>
            {cliente?.razonSocial || `${cliente?.apellido}, ${cliente?.nombre}`}
          </Descriptions.Item>
          <Descriptions.Item label="Cuit Cliente">{cliente?.cuit}</Descriptions.Item>
        </Descriptions>
      </>
    );
  };

  const renderDatosCuentas = () => {
    const { cuentaComision, cuentaDestino } = nuevaInstruccion.data.form || {};

    return (
      <>
        <Row>{renderFormTitle('Cuentas', 16)}</Row>
        <Descriptions size="small" layout="vertical" column={4} bordered>
          <Descriptions.Item label={Texts.ACCOUNT_TARGET}>{cuentaDestino?.valor}</Descriptions.Item>
          <Descriptions.Item label={Texts.ACCOUNT_COMMISSIONS} style={{ width: 200 }}>
            {cuentaComision?.valor}
          </Descriptions.Item>
        </Descriptions>
      </>
    );
  };

  const renderDatosImporte = () => {
    const { importe, concepto, cuentaDestino } = nuevaInstruccion.data.form || {};

    return (
      <>
        <Row>{renderFormTitle('Importe', 16)}</Row>
        <Descriptions size="small" layout="vertical" column={4} bordered>
          <Descriptions.Item label="Importe">{formatCurrencyAmount(importe!, cuentaDestino?.monedaIso)}</Descriptions.Item>
          <Descriptions.Item label="Concepto">{concepto?.descripcion}</Descriptions.Item>
        </Descriptions>
      </>
    );
  };

  //#endregion

  return (
    <Space size={'large'} wrap={true} direction="vertical" style={{ width: '100%' }}>
      <Row>{renderFormTitle(title)}</Row>
      <div style={{ overflowY: 'scroll', height: 540, marginBottom: 20, paddingRight: 24 }}>
        <Space size={'large'} wrap={true} direction="vertical">
          {renderDatosSolicitud()}
          {renderDatosCuentas()}
          {renderDatosImporte()}
        </Space>
      </div>
      <Row>
        <Space size={'middle'} wrap={true} direction="horizontal">
          {!nuevaInstruccion.info.instruccionCreada?.value ? (
            <>
              <Button type="primary" htmlType="button" disabled={nuevaInstruccion.info.instruccionCreada?.loading} onClick={handleOnConfirm}>
                Confirmar
              </Button>
              <Button type="default" htmlType="button" onClick={showConfirm}>
                Cancelar
              </Button>
            </>
          ) : (
            <>
              {/*            <Button type="primary" htmlType="button" onClick={handleOnReset}>
                Ver Ordenes de Pago
              </Button> */}
              <Button type="primary" htmlType="button" onClick={handleOnReset}>
                Crear Nueva Instrucción
              </Button>
            </>
          )}
        </Space>
      </Row>
    </Space>
  );
};
