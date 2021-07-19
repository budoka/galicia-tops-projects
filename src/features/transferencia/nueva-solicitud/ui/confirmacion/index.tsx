import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Descriptions, Modal, Row, Space, Typography } from 'antd';
import React, { useContext, useEffect } from 'react';
import { StateContext } from 'src/app';
import { RootState } from 'src/app/store';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import { Texts } from 'src/constants/texts';
import { getFreshToken } from 'src/utils/auth';
import { formatCurrencyAmount, formatDate } from 'src/utils/formatters';
import { Message } from 'src/utils/messages';
import { tiposPersona } from '..';
import { renderFormTitle } from '../../../../_shared/ui/utils';
import { NuevaSolicitudDataState, TipoCodigoBanco } from '../../data/interfaces';
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
  const nuevaSolicitud = useAppSelector((state: RootState) => state.transferencia.nuevaSolicitud);

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

  //#endregion

  //#region Other functions

  const canConfirm = () => {
    const status = nuevaSolicitud.ui.form.status;
    return Object.values(status).every((s) => {
      return s === true;
    });
  };

  const cleanData = () => {
    dispatch(cleanState());
  };

  //#endregion

  //#region Renders

  const renderDatosCliente = () => {
    const cliente = nuevaSolicitud.data.form?.datosOperacion?.cliente!;
    const vinculadoConBeneficiario = nuevaSolicitud.data.form?.normativas?.vinculadoConBeneficiario;

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
          <Descriptions.Item label="Vinculo con Beneficiario">{vinculadoConBeneficiario ? 'Sí' : ' No'}</Descriptions.Item>
          {/*      <Descriptions.Item label={documentoCliente?.descripcion}>{+documentoCliente?.numero!}</Descriptions.Item> */}
        </Descriptions>
      </>
    );
  };

  const renderDatosBeneficiario = () => {
    const beneficiario = nuevaSolicitud.data.form?.datosOperacion?.beneficiario;

    return (
      <>
        <Row>{renderFormTitle('Datos del Beneficiario', 16)}</Row>
        <Descriptions size="small" bordered>
          <Descriptions.Item label="Nombre / Razón Social" span={3}>
            {beneficiario?.razonSocial || `${beneficiario?.apellido}, ${beneficiario?.nombre}`}
          </Descriptions.Item>
          <Descriptions.Item label="Tipo de Documento">{beneficiario?.tipoDocumento}</Descriptions.Item>
          <Descriptions.Item label="Número de Documento">{beneficiario?.numeroDocumento}</Descriptions.Item>
          <Descriptions.Item label="NIF">{beneficiario?.nif}</Descriptions.Item>
          <Descriptions.Item label="Tipo de Persona">{beneficiario?.tipoPersona?.descripcion}</Descriptions.Item>
          <Descriptions.Item label="Pais">{beneficiario?.pais?.nombre}</Descriptions.Item>
        </Descriptions>
      </>
    );
  };

  const renderDatosCuentas = () => {
    const { cuentaOrigen, cuentaComisiones, beneficiario } = nuevaSolicitud.data.form?.datosOperacion || {};

    return (
      <>
        <Row>{renderFormTitle('Cuentas', 16)}</Row>
        <Descriptions size="small" layout="vertical" column={4} bordered>
          <Descriptions.Item label="Cuenta Origen de Fondos" style={{ width: 200 }}>
            {cuentaOrigen?.valor}
          </Descriptions.Item>
          <Descriptions.Item label="Cuenta Destino de Fondos">{`${beneficiario?.cuentaDestino?.numero} (${beneficiario?.cuentaDestino?.moneda.id})`}</Descriptions.Item>
          <Descriptions.Item label="Cuenta Débito de Comisiones" style={{ width: 200 }}>
            {cuentaComisiones?.valor}
          </Descriptions.Item>
          <Descriptions.Item label="Cuenta Intermediario">
            {beneficiario?.cuentaIntermediario?.numero
              ? `${beneficiario?.cuentaIntermediario?.numero} (${beneficiario?.cuentaIntermediario?.moneda.id})`
              : 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      </>
    );
  };

  const renderDatosImportes = () => {
    const { importes, moneda } = nuevaSolicitud.data.form?.datosOperacion || {};

    return (
      <>
        <Row>{renderFormTitle('Importes', 16)}</Row>
        <Descriptions size="small" layout="vertical" bordered>
          {importes?.map((i, index) => (
            <Descriptions.Item key={index} label={`Importe N°${index + 1}`}>
              <span>
                {formatCurrencyAmount(+i?.importe, moneda?.id)} ({i?.concepto.id})
              </span>
            </Descriptions.Item>
          ))}
        </Descriptions>
      </>
    );
  };

  const renderDatosVarios = () => {
    const { fechaEntrada, beneficiario, gastos } = nuevaSolicitud.data.form?.datosOperacion || {};

    return (
      <>
        <Row>{renderFormTitle('Varios', 16)}</Row>
        <Descriptions size="small" bordered>
          <Descriptions.Item label="Fecha de Entrada">{fechaEntrada && formatDate(fechaEntrada!, 'DD/MM/YYYY')}</Descriptions.Item>
          <Descriptions.Item label="Detalle de Gastos">{gastos?.detalle?.descripcion}</Descriptions.Item>
        </Descriptions>
        <Descriptions size="small" layout="vertical" bordered>
          <Descriptions.Item label="Banco Beneficiario">{beneficiario?.cuentaDestino?.nombreBanco}</Descriptions.Item>
          <Descriptions.Item label="Código Banco Intermediario">{`${beneficiario?.cuentaDestino?.codigoBanco} (${
            (beneficiario?.cuentaDestino?.tipoCodigoBanco as TipoCodigoBanco)?.descripcion
          })`}</Descriptions.Item>
          <Descriptions.Item label="País Banco Beneficiario">{beneficiario?.cuentaDestino?.pais?.nombre}</Descriptions.Item>
          {beneficiario?.cuentaIntermediario && (
            <>
              <Descriptions.Item label="Banco Intermediario">{beneficiario?.cuentaIntermediario?.nombreBanco}</Descriptions.Item>
              <Descriptions.Item label="Código Banco Intermediario">{`${beneficiario?.cuentaIntermediario?.codigoBanco} (${
                (beneficiario?.cuentaIntermediario?.tipoCodigoBanco as TipoCodigoBanco)?.descripcion
              })`}</Descriptions.Item>
              <Descriptions.Item label="País Banco Intermediario">{beneficiario?.cuentaIntermediario?.pais.nombre}</Descriptions.Item>
            </>
          )}
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
          {renderDatosBeneficiario()}
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
              {/*      <Button type="primary" htmlType="button" onClick={handleOnReset}>
                Ver Transferencias
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
