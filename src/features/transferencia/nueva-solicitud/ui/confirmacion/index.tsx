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
  const dispatch = useAppDispatch();

  const { title } = props;

  const nuevaSolicitud = useAppSelector((state: RootState) => state.transferencia.nuevaSolicitud);

  // useEffects

  useEffect(() => {}, []);

  // handlers

  const handleOnFinish = () => {
    if (isConfirmationEnabled()) dispatch(addSolicitud({ body: nuevaSolicitud.data as NuevaSolicitudDataState }));
  };

  const isConfirmationEnabled = () => {
    const status = nuevaSolicitud.ui.form.status;
    return Object.values(status).every((s) => {
      return s === true;
    });
  };

  // renders

  const renderDatosCliente = () => {
    const cliente = nuevaSolicitud.data.form?.datosOperacion?.cliente!;
    const vinculadoConBeneficiario = nuevaSolicitud.data.form?.normativas?.vinculadoConBeneficiario;

    const nombreCliente = {
      fisica: `${cliente?.apellido}, ${cliente?.nombre}`,
      juridica: `${cliente?.razonSocial}`,
    };

    // const documentoCliente = _.first(cliente.documentos.filter((d) => d.tipo === 'CUIT' || d.tipo === 'DU'));

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
        <Descriptions.Item label="NIF">{beneficiario?.nif}</Descriptions.Item>
        <Descriptions.Item label="Tipo de Persona">{beneficiario?.tipoPersona?.descripcion}</Descriptions.Item>
        <Descriptions.Item label="Pais">{beneficiario?.pais?.nombre}</Descriptions.Item>
        <Descriptions.Item label="Banco">{beneficiario?.cuentaDestino?.nombre}</Descriptions.Item>
        <Descriptions.Item label="Código Banco">{beneficiario?.cuentaDestino?.codigoBanco}</Descriptions.Item>
        <Descriptions.Item label="País Banco">{beneficiario?.cuentaDestino?.pais}</Descriptions.Item>
      </Descriptions>
    );
  };

  const renderDatosVarios = () => {
    const { cuentaDebito, cuentaDebitoGastos, beneficiario, gastos } = nuevaSolicitud.data.form?.datosOperacion || {};

    return (
      <Descriptions title="Varios" size="small" /* layout="vertical" */ column={4} bordered>
        <Descriptions.Item label="Banco Intermediario">{beneficiario?.cuentaIntermediario?.nombre}</Descriptions.Item>
        <Descriptions.Item label="Código Banco Intermediario">{beneficiario?.cuentaIntermediario?.codigoBanco}</Descriptions.Item>
        <Descriptions.Item label="País Banco Intermediario">{beneficiario?.cuentaIntermediario?.pais}</Descriptions.Item>
        {/*   <Descriptions.Item label="Swift Corresponsal">{gastos?.swiftCorresponsal}</Descriptions.Item> */}
      </Descriptions>
    );
  };

  const renderDatosCuentas = () => {
    const { cuentaDebito, cuentaDebitoGastos, beneficiario } = nuevaSolicitud.data.form?.datosOperacion || {};

    return (
      <Descriptions title="Cuentas" size="small" layout="vertical" bordered>
        <Descriptions.Item label="Cuenta Origen de Fondos">{cuentaDebito?.valor}</Descriptions.Item>
        <Descriptions.Item label="Cuenta Destino de Fondos">{beneficiario?.cuentaDestino?.cuenta}</Descriptions.Item>
        <Descriptions.Item label="Cuenta Gastos">{cuentaDebitoGastos?.valor ?? 'N/A'}</Descriptions.Item>
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

  return (
    <>
      <Space size={'middle'} wrap={true} direction="vertical">
        <Row>
          <Text>{renderFormTitle(title)}</Text>
        </Row>
        <Row>{renderDatosCliente()}</Row>
        <Row>{renderDatosBeneficiario()}</Row>
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
