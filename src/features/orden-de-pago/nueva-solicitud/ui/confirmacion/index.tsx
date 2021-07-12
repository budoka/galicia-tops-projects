import { ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
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
import { tiposPersona } from '..';
import { renderFormTitle } from '../../../../_shared/ui/utils';
import { NuevaSolicitudDataState } from '../../data/interfaces';
import { addSolicitud, cleanState } from '../../logic';

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
  const nuevaSolicitud = useAppSelector((state: RootState) => state.ordenDePago.nuevaSolicitud);

  //#region UseEffects

  useEffect(() => {}, []);

  //#endregion

  //#region Handlers

  const handleOnConfirm = async () => {
    const token = await getFreshToken(state.msalInstance!);

    if (canConfirm()) {
      Message.loading(Texts.REQUEST_CREATION_LOADING);

      const result = await dispatch(
        addSolicitud({
          headers: {
            Authorization: 'Bearer ' + token,
          },
          body: nuevaSolicitud.data as NuevaSolicitudDataState,
        }),
      );

      if (addSolicitud.fulfilled.match(result)) {
        Message.success(Texts.REQUEST_CREATION_OK);
      } else {
        Message.error(Texts.REQUEST_CREATION_ERROR);
      }
    }
  };

  const handleOnReset = () => {
    handleReset();
  };

  //#endregion

  //#region Other functions

  const canConfirm = () => {
    const status = nuevaSolicitud.ui.form.status;
    return Object.values(status).every((s) => {
      return s === true;
    });
  };

  const showConfirm = () =>
    confirm({
      title: 'Cancelar Solicitud',
      icon: <ExclamationCircleOutlined />,
      content: '¿Desea cancelar la solicitud y volver a crear otra? (Se perderán todos los datos cargados)',
      okText: 'Confirmar',
      cancelText: 'Cancelar',
      onOk() {
        handleOnReset();
      },
      onCancel() {},
    });

  /* 
  const showOk = () =>
    confirm({
      title: 'Solicitud creada',
      icon: <CheckCircleOutlined />,
      content: `Se ha creado una solicitud con el id ${11111}`, // La respuesta no está configurada para que devuelva el id de la solicitud
      okText: 'Confirmar',
      cancelText: 'Cancelar',
      onOk() {},
      onCancel() {},
    });
 */

  //#endregion

  //#region Renders

  const renderDatosCliente = () => {
    const cliente = nuevaSolicitud.data.form?.detalles?.cliente!;

    const nombreCliente = {
      fisica: `${cliente?.apellido}, ${cliente?.nombre}`,
      juridica: `${cliente?.razonSocial}`,
    };

    return (
      <>
        <Row>{renderFormTitle('Datos del Cliente', 16)}</Row>
        <Descriptions size="small" bordered>
          <Descriptions.Item label="Nombre / Razón Social" span={3}>
            {nombreCliente[cliente?.tipo]}
          </Descriptions.Item>
          <Descriptions.Item label="CUIT">{cliente?.cuit}</Descriptions.Item>
          <Descriptions.Item label="Tipo de Persona">{tiposPersona.find((t) => t.id === cliente?.tipo)?.descripcion}</Descriptions.Item>
        </Descriptions>
      </>
    );
  };

  const renderDatosOrdenante = () => {
    const ordenante = nuevaSolicitud.data.form?.detalles?.ordenante;

    return (
      <>
        <Row>{renderFormTitle('Datos del Ordenante', 16)}</Row>
        <Descriptions size="small" bordered>
          <Descriptions.Item label="Nombre / Razón Social" span={3}>
            {ordenante?.razonSocial || `${ordenante?.apellido}, ${ordenante?.nombre}`}
          </Descriptions.Item>
          <Descriptions.Item label="Tipo de Persona">{ordenante?.tipoPersona?.descripcion}</Descriptions.Item>
          <Descriptions.Item label="Pais">{ordenante?.pais?.nombre}</Descriptions.Item>
        </Descriptions>
      </>
    );
  };

  const renderDatosCuentas = () => {
    const { cuentaDestino, ordenante, gastos } = nuevaSolicitud.data.form?.detalles || {};

    return (
      <>
        <Row>{renderFormTitle('Cuentas', 16)}</Row>
        <Descriptions size="small" layout="vertical" column={4} bordered>
          <Descriptions.Item label="Cuenta Origen de Fondos">{`${ordenante?.cuentaOrigen?.numero} (${ordenante?.cuentaOrigen?.swiftBanco})`}</Descriptions.Item>
          <Descriptions.Item label="Cuenta Destino de Fondos" style={{ width: 200 }}>
            {cuentaDestino?.valor}
          </Descriptions.Item>
        </Descriptions>
      </>
    );
  };

  const renderDatosImportes = () => {
    const { importe, moneda, gastos } = nuevaSolicitud.data.form?.detalles || {};

    return (
      <>
        <Row>{renderFormTitle('Importes', 16)}</Row>
        <Descriptions size="small" layout="vertical" column={4} bordered>
          <Descriptions.Item label="Importe">{formatCurrencyAmount(importe!, moneda?.id)}</Descriptions.Item>
          <Descriptions.Item label="Importe Gastos">{formatCurrencyAmount(gastos?.importe!, gastos?.moneda?.id)}</Descriptions.Item>
          <Descriptions.Item label="Importe Total">{formatCurrencyAmount(sumAmounts([importe!, gastos?.importe!]), moneda?.id)}</Descriptions.Item>
        </Descriptions>
      </>
    );
  };

  const renderDatosVarios = () => {
    const { fechaEntrada, ordenante, gastos } = nuevaSolicitud.data.form?.detalles || {};

    return (
      <>
        <Row>{renderFormTitle('Varios', 16)}</Row>
        <Descriptions size="small" bordered>
          <Descriptions.Item label="Fecha de Entrada">{fechaEntrada && formatDate(fechaEntrada!, 'DD/MM/YYYY')}</Descriptions.Item>
          <Descriptions.Item label="Detalle de Gastos">{gastos?.detalle?.descripcion}</Descriptions.Item>
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
          {renderDatosCliente()}
          {renderDatosOrdenante()}
          {renderDatosCuentas()}
          {renderDatosImportes()}
          {renderDatosVarios()}
        </Space>
      </div>
      <Row>
        <Space size={'middle'} wrap={true} direction="horizontal">
          {!nuevaSolicitud.info.solicitudCreada?.value ? (
            <>
              <Button type="primary" htmlType="button" disabled={nuevaSolicitud.info.solicitudCreada?.loading} onClick={handleOnConfirm}>
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
                Crear Nueva Solicitud
              </Button>
            </>
          )}
        </Space>
      </Row>
    </Space>
  );
};
