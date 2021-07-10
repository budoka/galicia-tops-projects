import { Button, Descriptions, Form, Row, Space, Typography } from 'antd';
import { ArgsProps } from 'antd/lib/message';
import { addLeadingSlash } from 'history/PathUtils';
import React, { useEffect } from 'react';
import { RootState } from 'src/app/store';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import { formatCurrencyAmount } from 'src/utils/formatters';
import { tiposPersona } from '..';
import { renderFormTitle } from '../../../../_shared/ui/utils';
import { NuevaSolicitudDataState } from '../../data/interfaces';
import { addSolicitud } from '../../logic';

const { Text } = Typography;

const width = 250;

interface ConfirmacionPanelProps {
  title: string;
}

export const ConfirmacionPanel: React.FC<ConfirmacionPanelProps> = (props) => {
  const { title } = props;

  const dispatch = useAppDispatch();
  const nuevaSolicitud = useAppSelector((state: RootState) => state.transferencia.nuevaSolicitud);

  //#region UseEffects

  useEffect(() => {}, []);

  //#endregion

  //#region Handlers

  const handleOnFinish = () => {
    if (canAdvance()) dispatch(addSolicitud({ body: nuevaSolicitud.data as NuevaSolicitudDataState }));
  };

  //#endregion

  //#region Other functions

  const canAdvance = () => {
    const status = nuevaSolicitud.ui.form.status;
    return Object.values(status).every((s) => {
      return s === true;
    });
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
      <Descriptions title="Datos del Cliente" size="small" bordered>
        <Descriptions.Item label="Nombre / Razón Social" span={3}>
          {nombreCliente[cliente?.tipo]}
        </Descriptions.Item>
        <Descriptions.Item label="CUIT">{cliente?.cuit}</Descriptions.Item>
        <Descriptions.Item label="Tipo de Persona">{tiposPersona.find((t) => t.id === cliente?.tipo)?.descripcion}</Descriptions.Item>
        <Descriptions.Item label="Vinculo con Beneficiario">{vinculadoConBeneficiario ? 'Sí' : ' No'}</Descriptions.Item>
        {/*      <Descriptions.Item label={documentoCliente?.descripcion}>{+documentoCliente?.numero!}</Descriptions.Item> */}
      </Descriptions>
    );
  };

  const renderDatosBeneficiario = () => {
    const beneficiario = nuevaSolicitud.data.form?.datosOperacion?.beneficiario;

    return (
      <Descriptions title="Datos del Beneficiario" size="small" bordered>
        <Descriptions.Item label="Nombre / Razón Social" span={3}>
          {beneficiario?.razonSocial ?? `${beneficiario?.apellido}, ${beneficiario?.nombre}`}
        </Descriptions.Item>
        <Descriptions.Item label="Tipo de Documento">{beneficiario?.tipoDocumento}</Descriptions.Item>
        <Descriptions.Item label="Número de Documento">{beneficiario?.numeroDocumento}</Descriptions.Item>
        <Descriptions.Item label="NIF">{beneficiario?.nif}</Descriptions.Item>
        <Descriptions.Item label="Tipo de Persona">{beneficiario?.tipoPersona?.descripcion}</Descriptions.Item>
        <Descriptions.Item label="Pais">{beneficiario?.pais?.nombre}</Descriptions.Item>
      </Descriptions>
    );
  };

  const renderGastos = () => {
    const { gastos } = nuevaSolicitud.data.form?.datosOperacion || {};

    return (
      <Descriptions title="Gastos" size="small" bordered>
        <Descriptions.Item label="Detalle de Gastos">{gastos?.detalle.descripcion}</Descriptions.Item>
      </Descriptions>
    );
  };

  const renderDatosCuentas = () => {
    const { cuentaOrigen, cuentaComisiones, beneficiario } = nuevaSolicitud.data.form?.datosOperacion || {};

    return (
      <Descriptions title="Cuentas" size="small" layout="vertical" column={4} bordered>
        <Descriptions.Item label="Cuenta Origen de Fondos" style={{ width: 200 }}>
          {cuentaOrigen?.valor}
        </Descriptions.Item>
        <Descriptions.Item label="Cuenta Destino de Fondos">{`${beneficiario?.cuentaDestino?.numero} (${beneficiario?.cuentaDestino?.moneda.id})`}</Descriptions.Item>
        <Descriptions.Item label="Cuenta Débito de Comisiones" style={{ width: 200 }}>
          {cuentaComisiones?.valor}
        </Descriptions.Item>
        <Descriptions.Item label="Cuenta Intermediario">
          {beneficiario?.cuentaIntermediario?.numero ? `${beneficiario?.cuentaIntermediario?.numero} (${beneficiario?.cuentaIntermediario?.moneda.id})` : 'N/A'}
        </Descriptions.Item>
      </Descriptions>
    );
  };

  const renderDatosImportes = () => {
    const { importes, moneda } = nuevaSolicitud.data.form?.datosOperacion || {};

    return (
      <Descriptions title="Importes" size="small" layout="vertical" bordered>
        {importes?.map((i, index) => (
          <Descriptions.Item key={index} label={`Importe N°${index + 1}`}>
            <span>
              {formatCurrencyAmount(+i?.importe, moneda?.id)} ({i?.concepto.id})
            </span>
          </Descriptions.Item>
        ))}
      </Descriptions>
    );
  };

  const renderDatosVarios = () => {
    const { cuentaOrigen, cuentaComisiones, beneficiario, gastos } = nuevaSolicitud.data.form?.datosOperacion || {};

    return (
      <Descriptions title="Varios" size="small" bordered>
        <Descriptions.Item label="Banco Beneficiario">{beneficiario?.cuentaDestino?.nombreBanco}</Descriptions.Item>
        <Descriptions.Item label="Código Banco Intermediario">{`${beneficiario?.cuentaDestino?.codigoBanco} (${beneficiario?.cuentaDestino?.tipoCodigoBanco})`}</Descriptions.Item>
        <Descriptions.Item label="País Banco Beneficiario">{beneficiario?.cuentaDestino?.pais.nombre}</Descriptions.Item>
        <Descriptions.Item label="Banco Intermediario">{beneficiario?.cuentaIntermediario?.nombreBanco}</Descriptions.Item>
        <Descriptions.Item label="Código Banco Intermediario">{`${beneficiario?.cuentaIntermediario?.codigoBanco} (${beneficiario?.cuentaIntermediario?.tipoCodigoBanco})`}</Descriptions.Item>
        <Descriptions.Item label="País Banco Intermediario">{beneficiario?.cuentaIntermediario?.pais.nombre}</Descriptions.Item>
      </Descriptions>
    );
  };

  //#endregion

  return (
    <>
      <Space size={'middle'} wrap={true} direction="vertical">
        <Row>
          <Text>{renderFormTitle(title)}</Text>
        </Row>
        <Row>{renderDatosCliente()}</Row>
        <Row>{renderDatosBeneficiario()}</Row>
        <Row>{renderGastos()}</Row>
        <Row>{renderDatosCuentas()}</Row>
        <Row>{renderDatosImportes()}</Row>
        <Row>{renderDatosVarios()}</Row>
        <Row>
          <Button type="primary" htmlType="button" onChange={handleOnFinish}>
            Confirmar
          </Button>
        </Row>
      </Space>
    </>
  );
};
