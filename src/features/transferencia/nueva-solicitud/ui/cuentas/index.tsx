import { Button, Checkbox, Col, Form, Input, Row, Select, Space } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { RootState } from 'src/app/store';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import { Texts } from 'src/constants/texts';
import { TipoCodigoBanco as TipoCodigoBancoType } from 'src/features/_shared/data/types';
import { Rules } from 'src/types/interfaces';
import { tiposCodigoBanco } from '..';
import { getRule, getValueFromOptions, renderFormTitle, renderOptions } from '../../../../_shared/ui/utils';
import { CuentasForm, FormNames } from '../../data/forms';
import { TipoCodigoBanco } from '../../data/interfaces';
import { setActiveForm, setDatosCuentas, setEstadoForm } from '../../logic';
import styles from './style.module.less';

const width = 250;

const rules: Rules = {
  cuentaOrigen: [
    {
      required: true,
      message: 'Cuenta no válida',
    },
  ],
  cuentaComisiones: [
    {
      required: true,
      message: 'Cuenta no válida',
    },
  ],
  cuentaDestino: {
    nombreBanco: [
      {
        required: true,
        message: 'Banco no válido',
      },
    ],
    localidadBanco: [
      {
        required: true,
        message: 'Localidad no válida',
      },
    ],
    pais: [
      {
        required: true,
        message: 'País no válido',
      },
    ],
    moneda: [
      {
        required: true,
        message: 'Moneda no válida',
      },
    ],
    numero: [
      {
        required: true,
        message: 'Número de Cuenta no válido',
      },
    ],
    tipoCodigoBanco: [
      {
        required: false,
        message: 'Tipo de Código no válido',
      },
    ],
    codigoBanco: [
      {
        required: false,
        message: 'Código no válido',
      },
    ],
    tipoCodigoBancoAdicional: [
      {
        required: false,
        message: 'Tipo de Código no válido',
      },
    ],
    codigoBancoAdicional: [
      {
        required: false,
        message: 'Código no válido',
      },
    ],
  },
  cuentaIntermediario: {
    nombreBanco: [
      {
        required: true,
        message: 'Banco no válido',
      },
    ],
    localidadBanco: [
      {
        required: true,
        message: 'Localidad no válida',
      },
    ],
    pais: [
      {
        required: true,
        message: 'País no válido',
      },
    ],
    moneda: [
      {
        required: true,
        message: 'Moneda no válida',
      },
    ],
    numero: [
      {
        required: true,
        message: 'Número de Cuenta no válido',
      },
    ],
    tipoCodigoBanco: [
      {
        required: false,
        message: 'Tipo de Código no válido',
      },
    ],
    codigoBanco: [
      {
        required: false,
        message: 'Código no válido',
      },
    ],
    tipoCodigoBancoAdicional: [
      {
        required: false,
        message: 'Tipo de Código no válido',
      },
    ],
    codigoBancoAdicional: [
      {
        required: false,
        message: 'Código no válido',
      },
    ],
  },
};

interface CuentasFormPanelProps {
  title: string;
  form: FormInstance<CuentasForm>;
}

export const CuentasFormPanel: React.FC<CuentasFormPanelProps> = (props) => {
  const { title, form } = props;

  const dispatch = useAppDispatch();
  const nuevaSolicitud = useAppSelector((state: RootState) => state.transferencia.nuevaSolicitud);
  const shared = useAppSelector((state: RootState) => state.shared);

  const [hasIntermediary, setHasIntermediary] = useState<boolean>(!!nuevaSolicitud.data.form?.datosOperacion?.beneficiario?.cuentaIntermediario);

  //#region UseEffects

  useEffect(() => {
    const currentActiveForm = nuevaSolicitud.ui.form.active;
    const currentStatus = nuevaSolicitud.ui.form.status.cuentas;
    if (currentActiveForm === FormNames.CUENTAS && currentStatus) {
      const { cuentaOrigen, cuentaComisiones, beneficiario } = nuevaSolicitud.data.form?.datosOperacion || {};
      form.resetFields();
      form.setFieldsValue({
        cuentaOrigen: getValueFromOptions(cuentaOrigen?.valor!, nuevaSolicitud.info.cuentas?.value!),
        cuentaComisiones: getValueFromOptions(cuentaComisiones?.valor!, nuevaSolicitud.info.cuentas?.value!),
        cuentaDestino: {
          ...beneficiario?.cuentaDestino!,
          moneda: getValueFromOptions(beneficiario?.cuentaDestino?.moneda?.id!, shared.monedas?.value!),
          pais: getValueFromOptions(beneficiario?.cuentaDestino?.pais?.id!, shared.paises?.value!),
          tipoCodigoBanco: getValueFromOptions((beneficiario?.cuentaDestino?.tipoCodigoBanco as TipoCodigoBanco)?.id!, tiposCodigoBanco),
        },
        cuentaIntermediario: beneficiario?.cuentaIntermediario
          ? {
              ...beneficiario?.cuentaIntermediario!,
              moneda: getValueFromOptions(beneficiario?.cuentaIntermediario?.moneda?.id!, shared.monedas?.value!),
              pais: getValueFromOptions(beneficiario?.cuentaIntermediario?.pais?.id!, shared.paises?.value!),
              tipoCodigoBanco: beneficiario?.cuentaIntermediario?.tipoCodigoBanco as string,
            }
          : undefined,
        cuentaIntermediarioHabilitada: hasIntermediary,
      });
    }
  }, [nuevaSolicitud.ui.form.active]);

  //#endregion

  //#region Handlers

  const handleOnFinish = () => {
    setData();
    dispatch(setEstadoForm({ cuentas: true }));
    dispatch(setActiveForm(FormNames.IMPORTES));
  };

  const handleIntermediaryAccount = () => setHasIntermediary((v) => !v);

  const handleFill = () => {
    form.setFieldsValue({
      cuentaDestino: {
        localidadBanco: 'Localidad',
        nombreBanco: 'Nombre',
        codigoBanco: 'Codigo',
        tipoCodigoBanco: getValueFromOptions('aba', tiposCodigoBanco),
        codigoBancoAdicional: 'Codigo 2',
        tipoCodigoBancoAdicional: 'tipooo',
        numero: '1234567889',
        moneda: getValueFromOptions('ARS', shared.monedas?.value!),
        pais: getValueFromOptions('AR', shared.paises?.value!),
      },
    });

    console.log(form.getFieldsValue());
  };

  //#endregion

  //#region Other functions

  const setData = () => {
    const { cuentaOrigen, cuentaComisiones, cuentaDestino, cuentaIntermediario } = form.getFieldsValue() || {};
    dispatch(
      setDatosCuentas({
        cuentaOrigen: nuevaSolicitud.info.cuentas?.value?.find((c) => c.id === cuentaOrigen?.value)!,
        cuentaComisiones: nuevaSolicitud.info.cuentas?.value?.find((c) => c.id === cuentaComisiones?.value)!,
        cuentaDestino: {
          ...cuentaDestino!,
          tipoCodigoBanco: {
            id: cuentaDestino?.tipoCodigoBanco?.value?.toString()! as TipoCodigoBancoType,
            descripcion: cuentaDestino?.tipoCodigoBanco?.label?.toString()!,
          },
          moneda: { id: cuentaDestino?.moneda?.value?.toString()!, descripcion: cuentaDestino?.moneda?.label?.toString()! },
          pais: { id: cuentaDestino?.pais?.value?.toString()!, nombre: cuentaDestino?.pais?.label?.toString()! },
        },
        cuentaIntermediario: !hasIntermediary
          ? undefined
          : {
              ...cuentaIntermediario!,
              tipoCodigoBanco: cuentaIntermediario?.tipoCodigoBanco as TipoCodigoBancoType,
              moneda: { id: cuentaIntermediario?.moneda?.value?.toString()!, descripcion: cuentaIntermediario?.moneda?.label?.toString()! },
              pais: { id: cuentaIntermediario?.pais?.value?.toString()!, nombre: cuentaIntermediario?.pais?.label?.toString()! },
            },
      }),
    );
  };

  //#endregion

  return (
    <>
      <Form className={styles.form} form={form} layout="vertical" onFinish={handleOnFinish}>
        <Form.Item>{renderFormTitle(title)}</Form.Item>
        <div style={{ overflowY: 'scroll', height: 540, marginBottom: 20 }}>
          <Form.Item>{renderFormTitle(Texts.ACCOUNTS_CLIENT, 16)}</Form.Item>

          <Row wrap={false}>
            <Space size={'middle'}>
              <Col style={{ width }}>
                <Form.Item label={Texts.ACCOUNT_SOURCE} name={'cuentaOrigen'} rules={getRule(rules, 'cuentaOrigen')} required>
                  <Select
                    labelInValue
                    placeholder={Texts.SELECT_ACCOUNT}
                    loading={nuevaSolicitud.info.cuentas?.loading}
                    disabled={nuevaSolicitud.info.cuentas?.loading}>
                    {renderOptions(nuevaSolicitud.info.cuentas?.value!, 'valor')}
                  </Select>
                </Form.Item>
              </Col>

              <Col style={{ width }}>
                <Form.Item label={Texts.ACCOUNT_COMMISSIONS} name={'cuentaComisiones'} rules={getRule(rules, 'cuentaComisiones')} required>
                  <Select
                    labelInValue
                    placeholder={Texts.SELECT_ACCOUNT}
                    loading={nuevaSolicitud.info.cuentas?.loading}
                    disabled={nuevaSolicitud.info.cuentas?.loading}>
                    {renderOptions(nuevaSolicitud.info.cuentas?.value!, 'valor')}
                  </Select>
                </Form.Item>
              </Col>
            </Space>
          </Row>

          <Form.Item>{renderFormTitle(Texts.ACCOUNT_BENEFICIARY, 16)}</Form.Item>

          <Row wrap={false}>
            <Space size={'middle'}>
              <Col style={{ width }}>
                <Form.Item label={Texts.BANK} name={['cuentaDestino', 'nombreBanco']} rules={getRule(rules, ['cuentaDestino', 'nombreBanco'])}>
                  <Input />
                </Form.Item>
              </Col>

              <Col style={{ width }}>
                <Form.Item label={Texts.LOCALITY} name={['cuentaDestino', 'localidadBanco']} rules={getRule(rules, ['cuentaDestino', 'localidadBanco'])}>
                  <Input />
                </Form.Item>
              </Col>

              <Col style={{ width }}>
                <Form.Item label={Texts.COUNTRY} name={['cuentaDestino', 'pais']} rules={getRule(rules, ['cuentaDestino', 'pais'])} required>
                  <Select
                    labelInValue
                    showSearch
                    optionFilterProp="children"
                    placeholder={Texts.SELECT_COUNTRY}
                    loading={shared.paises?.loading}
                    disabled={shared.paises?.loading}>
                    {renderOptions(shared.paises?.value!, 'nombre')}
                  </Select>
                </Form.Item>
              </Col>
            </Space>
          </Row>

          <Row wrap={false}>
            <Space size={'middle'}>
              <Col style={{ width }}>
                <Form.Item label={Texts.CURRENCY} name={['cuentaDestino', 'moneda']} rules={getRule(rules, ['cuentaDestino', 'moneda'])} required>
                  <Select
                    labelInValue
                    showSearch
                    optionFilterProp="children"
                    placeholder={Texts.SELECT_CURRENCY}
                    loading={shared.monedas?.loading}
                    disabled={shared.monedas?.loading}>
                    {renderOptions(shared.monedas?.value!, 'descripcion')}
                  </Select>
                </Form.Item>
              </Col>

              <Col style={{ width }}>
                <Form.Item label={Texts.ACCOUNT_NUMBER} name={['cuentaDestino', 'numero']} rules={getRule(rules, ['cuentaDestino', 'numero'])}>
                  <Input />
                </Form.Item>
              </Col>

              <Col style={{ width }}>
                <Form.Item
                  label={Texts.BANK_CODE_TYPE}
                  name={['cuentaDestino', 'tipoCodigoBanco']}
                  rules={getRule(rules, ['cuentaDestino', 'tipoCodigoBanco'])}>
                  <Select labelInValue optionFilterProp="children" placeholder={Texts.SELECT_BANK_CODE_TYPE}>
                    {renderOptions(tiposCodigoBanco, 'descripcion')}
                  </Select>
                </Form.Item>
              </Col>
            </Space>
          </Row>

          <Row wrap={false}>
            <Space size={'middle'}>
              <Col style={{ width }}>
                <Form.Item label={Texts.BANK_CODE} name={['cuentaDestino', 'codigoBanco']} rules={getRule(rules, ['cuentaDestino', 'codigoBanco'])}>
                  <Input />
                </Form.Item>
              </Col>

              <Col style={{ width }}>
                <Form.Item
                  label={Texts.BANK_CODE_TYPE_OPTIONAL}
                  name={['cuentaDestino', 'tipoCodigoBancoAdicional']}
                  rules={getRule(rules, ['cuentaDestino', 'tipoCodigoBancoAdicional'])}>
                  <Input />
                </Form.Item>
              </Col>

              <Col style={{ width }}>
                <Form.Item
                  label={Texts.BANK_CODE_OPTIONAL}
                  name={['cuentaDestino', 'codigoBancoAdicional']}
                  rules={getRule(rules, ['cuentaDestino', 'codigoBancoAdicional'])}>
                  <Input />
                </Form.Item>
              </Col>
            </Space>
          </Row>

          <Form.Item>{renderFormTitle(Texts.ACCOUNT_INTERMEDIARY, 16)}</Form.Item>

          <Row wrap={false}>
            <Space size={'middle'}>
              <Col style={{ width }}>
                <Form.Item name={'cuentaIntermediarioHabilitada'} valuePropName="checked">
                  <Checkbox onChange={handleIntermediaryAccount}>{Texts.ACCOUNT_INTERMEDIARY}</Checkbox>
                </Form.Item>
              </Col>
            </Space>
          </Row>

          {hasIntermediary && (
            <>
              <Row wrap={false}>
                <Space size={'middle'}>
                  <Col style={{ width }}>
                    <Form.Item label={Texts.BANK} name={['cuentaIntermediario', 'nombreBanco']} rules={getRule(rules, ['cuentaIntermediario', 'nombreBanco'])}>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col style={{ width }}>
                    <Form.Item
                      label={Texts.LOCALITY}
                      name={['cuentaIntermediario', 'localidadBanco']}
                      rules={getRule(rules, ['cuentaIntermediario', 'localidadBanco'])}>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col style={{ width }}>
                    <Form.Item label={Texts.COUNTRY} name={['cuentaIntermediario', 'pais']} rules={getRule(rules, ['cuentaIntermediario', 'pais'])} required>
                      <Select
                        labelInValue
                        showSearch
                        optionFilterProp="children"
                        placeholder={Texts.SELECT_COUNTRY}
                        loading={shared.paises?.loading}
                        disabled={shared.paises?.loading}>
                        {renderOptions(shared.paises?.value!, 'nombre')}
                      </Select>
                    </Form.Item>
                  </Col>
                </Space>
              </Row>

              <Row wrap={false}>
                <Space size={'middle'}>
                  <Col style={{ width }}>
                    <Form.Item
                      label={Texts.CURRENCY}
                      name={['cuentaIntermediario', 'moneda']}
                      rules={getRule(rules, ['cuentaIntermediario', 'moneda'])}
                      required>
                      <Select
                        labelInValue
                        showSearch
                        optionFilterProp="children"
                        placeholder={Texts.SELECT_CURRENCY}
                        loading={shared.monedas?.loading}
                        disabled={shared.monedas?.loading}>
                        {renderOptions(shared.monedas?.value!, 'descripcion')}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col style={{ width }}>
                    <Form.Item label={Texts.ACCOUNT_NUMBER} name={['cuentaIntermediario', 'numero']} rules={getRule(rules, ['cuentaIntermediario', 'numero'])}>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col style={{ width }}>
                    <Form.Item
                      label={Texts.BANK_CODE_TYPE}
                      name={['cuentaIntermediario', 'tipoCodigoBanco']}
                      rules={getRule(rules, ['cuentaIntermediario', 'tipoCodigoBanco'])}>
                      <Select labelInValue optionFilterProp="children" placeholder={Texts.SELECT_BANK_CODE_TYPE}>
                        {renderOptions(tiposCodigoBanco, 'descripcion')}
                      </Select>
                    </Form.Item>
                  </Col>
                </Space>
              </Row>
              <Row wrap={false}>
                <Space size={'middle'}>
                  <Col style={{ width }}>
                    <Form.Item
                      label={Texts.BANK_CODE}
                      name={['cuentaIntermediario', 'codigoBanco']}
                      rules={getRule(rules, ['cuentaIntermediario', 'codigoBanco'])}>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col style={{ width }}>
                    <Form.Item
                      label={Texts.BANK_CODE_TYPE_OPTIONAL}
                      name={['cuentaIntermediario', 'tipoCodigoBancoAdicional']}
                      rules={getRule(rules, ['cuentaIntermediario', 'tipoCodigoBancoAdicional'])}>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col style={{ width }}>
                    <Form.Item
                      label={Texts.BANK_CODE_OPTIONAL}
                      name={['cuentaIntermediario', 'codigoBancoAdicional']}
                      rules={getRule(rules, ['cuentaIntermediario', 'codigoBancoAdicional'])}>
                      <Input />
                    </Form.Item>
                  </Col>
                </Space>
              </Row>
            </>
          )}
        </div>

        <Form.Item style={{ position: 'sticky', top: 550 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              Confirmar
            </Button>
            <Button type="link" htmlType="button" onClick={handleFill}>
              Completar
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};
