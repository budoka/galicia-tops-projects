import { ClearOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Form, Input, Row, Select, Space } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import React, { useEffect } from 'react';
import { RootState } from 'src/app/store';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import { Pattern } from 'src/constants';
import { Texts } from 'src/constants/texts';
import { fetchCuentas, fetchDatosClientes } from 'src/features/_shared/logic';
import { Rules } from 'src/types/interfaces';
import { Message } from 'src/utils/messages';
import { getRule, getValueFromOptions, renderFormTitle, renderOptions } from '../../../../_shared/ui/utils';
import { FormNames, InstruccionForm, SolicitudForm } from '../../data/forms';
import { fetchDatosSolicitud, resetSolicitud, setActiveForm, setDatosInstruccion, setEstadoForm } from '../../logic';
import styles from './style.module.less';

const width = 250;

const rules: Rules = {
  solicitudId: [
    {
      required: true,
      pattern: Pattern.ONLY_NUMBERS,
      message: 'Solicitud no válida',
    },
  ],
  cuentaDestino: [
    {
      required: true,
      message: 'Cuenta no válida',
    },
  ],
  cuentaComision: [
    {
      required: true,
      message: 'Cuenta no válida',
    },
  ],
  importe: [
    {
      required: true,
      pattern: Pattern.CURRENCY_AMOUNT_POSITIVE,
      message: 'Importe no válido',
    },
  ],
  concepto: [
    {
      required: true,
      message: 'Concepto no válido',
    },
  ],
};

interface InstruccionFormPanelProps {
  title: string;
  solicitudForm: FormInstance<SolicitudForm>;
  instruccionForm: FormInstance<InstruccionForm>;
}

export const InstruccionFormPanel: React.FC<InstruccionFormPanelProps> = (props) => {
  const { title, solicitudForm, instruccionForm } = props;

  const dispatch = useAppDispatch();
  const nuevaInstruccion = useAppSelector((state: RootState) => state.ordenDePago.nuevaInstruccion);
  const shared = useAppSelector((state: RootState) => state.shared);

  //#region UseEffects

  useEffect(() => {
    const currentActiveForm = nuevaInstruccion.ui.form.active;
    const currentStatus = nuevaInstruccion.ui.form.status.instruccion;
    if (currentActiveForm === FormNames.INSTRUCCION && currentStatus) {
      const { concepto, cuentaComision, cuentaDestino, importe, solicitudId } = nuevaInstruccion.data.form || {};
      instruccionForm.resetFields();
      instruccionForm.setFieldsValue({
        concepto: getValueFromOptions(concepto?.id!, shared.conceptos?.value!),
        cuentaComision: getValueFromOptions(cuentaComision?.valor!, nuevaInstruccion.info.cuentas?.value!),
        cuentaDestino: getValueFromOptions(cuentaDestino?.valor!, nuevaInstruccion.info.cuentas?.value!),
        importe,
        solicitudId,
      });
    }
  }, [nuevaInstruccion.ui.form.active]);

  //#endregion

  //#region Handlers

  const handleSolicitud = () => {
    fetchSolicitud();
  };

  const handleCleanSolicitud = () => {
    resetDataSolicitud();
  };

  const handleOnFinish = () => {
    setData();
    dispatch(setEstadoForm({ instruccion: true }));
    dispatch(setActiveForm(FormNames.CONFIRMACION));
  };

  //#endregion

  //#region Other functions

  const fetchSolicitud = () => {
    solicitudForm
      .validateFields()
      .then(async () => {
        Message.loading(Texts.SEARCH_REQUEST_LOADING);

        const id = solicitudForm.getFieldsValue().solicitudId;
        const solicitud = await dispatch(fetchDatosSolicitud({ placeholders: { id } }));

        if (fetchDatosSolicitud.fulfilled.match(solicitud)) {
          const hostId = solicitud.payload.data?.cliente.hostId!;
          const cuentas = await dispatch(fetchCuentas({ query: { hostId, productos: 'CA,CC' } }));

          if (fetchCuentas.fulfilled.match(cuentas)) {
            dispatch(setEstadoForm({ solicitud: true }));
            Message.success(Texts.SEARCH_REQUEST_OK);
          } else {
            Message.error(Texts.SEARCH_REQUEST_ERROR);
          }
        } else {
          Message.error(Texts.SEARCH_REQUEST_ERROR);
        }
      })
      .catch(() => {
        /* Error al validar. No requiere acción. */
      });
  };

  const resetDataSolicitud = () => {
    dispatch(resetSolicitud());

    solicitudForm.setFieldsValue({
      solicitudId: undefined,
    });

    dispatch(setEstadoForm({ solicitud: false, instruccion: false }));
  };

  const setData = () => {
    const { concepto, cuentaComision, cuentaDestino, importe, solicitudId } = instruccionForm.getFieldsValue() || {};
    dispatch(
      setDatosInstruccion({
        concepto: shared.conceptos?.value?.find((c) => c.id === concepto?.value)!,
        cuentaComision: nuevaInstruccion.info.cuentas?.value?.find((c) => c.id === cuentaComision?.value)!,
        cuentaDestino: nuevaInstruccion.info.cuentas?.value?.find((c) => c.id === cuentaDestino?.value)!,
        importe,
        solicitudId,
      }),
    );
  };

  //#endregion

  //#region Renders

  const renderDatosCliente = () => {
    const cliente = nuevaInstruccion.info.solicitud?.value?.cliente;

    if (!cliente) return undefined;

    const nombreCliente = {
      fisica: `${cliente.apellido}, ${cliente.nombre}`,
      juridica: `${cliente.razonSocial}`,
    };

    const tipo = cliente.razonSocial === '' ? 'fisica' : 'juridica';

    const datosCliente = (
      <div className={styles.messageClienteWrapper}>
        <span className={styles.messageClienteNombre}>{nombreCliente[tipo]}</span>
        <span className={styles.messageClienteTipoPersona}>{tipo.toUpperCase()}</span>
        <span className={styles.messageClienteHostId}>{cliente.hostId} (Host ID)</span>
        <span className={styles.messageClienteDocumento}>{cliente.cuit} (CUIT)</span>
      </div>
    );

    return <Alert type="success" style={{ fontWeight: 'bold' }} message={datosCliente} />;
  };

  //#endregion

  return (
    <>
      <Form className={styles.form} form={solicitudForm} layout="vertical" onFinish={handleSolicitud}>
        <Form.Item>{renderFormTitle(title)}</Form.Item>

        <Row wrap={false}>
          <Space size={'middle'}>
            <Form.Item style={{ marginBottom: 0 }}>
              <Space size={'middle'}>
                <Form.Item label={Texts.REQUEST} name={'solicitudId'} rules={getRule(rules, 'solicitudId')} required>
                  <Input disabled={nuevaInstruccion.ui.form.status.solicitud} />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={nuevaInstruccion.info.solicitud?.loading || nuevaInstruccion.info.cuentas?.loading || nuevaInstruccion.ui.form.status.solicitud}
                  //loading={nuevaSolicitud.info.clientes?.loading}
                  style={{ marginTop: 5 }}>
                  Buscar
                </Button>
                <Button
                  onClick={handleCleanSolicitud}
                  type="default"
                  htmlType="button"
                  disabled={nuevaInstruccion.info.solicitud?.loading || nuevaInstruccion.info.cuentas?.loading}
                  style={{ marginTop: 5 }}>
                  <ClearOutlined />
                </Button>
              </Space>
            </Form.Item>
          </Space>
        </Row>
      </Form>
      {nuevaInstruccion.ui.form.status.solicitud && (
        <>
          <Form className={styles.form} form={instruccionForm} layout="vertical" onFinish={handleOnFinish}>
            <Form.Item style={{ width: 323 }}>{renderDatosCliente()}</Form.Item>

            <Form.Item>{renderFormTitle(Texts.ACCOUNTS, 16)}</Form.Item>

            <Row wrap={false}>
              <Space size={'middle'}>
                <Col style={{ width }}>
                  <Form.Item label={Texts.ACCOUNT_TARGET} name={'cuentaDestino'} rules={getRule(rules, 'cuentaDestino')} required>
                    <Select
                      labelInValue
                      placeholder={Texts.SELECT_ACCOUNT}
                      loading={nuevaInstruccion.info.cuentas?.loading}
                      disabled={nuevaInstruccion.info.cuentas?.loading || !nuevaInstruccion.ui.form.status.solicitud}>
                      {renderOptions(nuevaInstruccion.info.cuentas?.value!, 'valor')}
                    </Select>
                  </Form.Item>
                </Col>

                <Col style={{ width }}>
                  <Form.Item label={Texts.ACCOUNT_COMMISSIONS} name={'cuentaComision'} rules={getRule(rules, 'cuentaComision')} required>
                    <Select
                      labelInValue
                      placeholder={Texts.SELECT_ACCOUNT}
                      loading={nuevaInstruccion.info.cuentas?.loading}
                      disabled={nuevaInstruccion.info.cuentas?.loading || !nuevaInstruccion.ui.form.status.solicitud}>
                      {renderOptions(nuevaInstruccion.info.cuentas?.value!, 'valor')}
                    </Select>
                  </Form.Item>
                </Col>
              </Space>
            </Row>

            <Form.Item>{renderFormTitle(Texts.AMOUNT, 16)}</Form.Item>

            <Row wrap={false}>
              <Space size={'middle'}>
                <Col style={{ width }}>
                  <Form.Item label={Texts.AMOUNT} name={'importe'} rules={getRule(rules, 'importe')} required>
                    <Input disabled={!nuevaInstruccion.ui.form.status.solicitud} />
                  </Form.Item>
                </Col>

                <Col style={{ width }}>
                  <Form.Item label={Texts.CONCEPT} name={'concepto'} rules={getRule(rules, 'concepto')} required>
                    <Select
                      labelInValue
                      showSearch
                      optionFilterProp="children"
                      placeholder={Texts.SELECT_CONCEPT}
                      loading={shared.conceptos?.loading}
                      disabled={shared.conceptos?.loading || !nuevaInstruccion.ui.form.status.solicitud}>
                      {renderOptions(shared.conceptos?.value!, 'descripcion')}
                    </Select>
                  </Form.Item>
                </Col>
              </Space>
            </Row>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Confirmar
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </>
      )}
    </>
  );
};
