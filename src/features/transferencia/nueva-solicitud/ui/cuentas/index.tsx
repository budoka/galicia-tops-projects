import { Button, Col, Form, Input, Row, Select, Space } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import { ArgsProps } from 'antd/lib/message';
import React, { useEffect } from 'react';
import { RootState } from 'src/app/store';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import { Texts } from 'src/constants/texts';
import { Rules } from 'src/types/interfaces';
import { tiposCodigoBanco } from '..';
import { getOption, getRule, renderFormTitle, renderOptions } from '../../../../_shared/ui/utils';
import { CuentasForm, FormNames } from '../../data/forms';
import { setActiveForm, setDatosCuentas, setEstadoForm } from '../../logic';
import styles from './style.module.less';

const width = 250;

const rules: Rules = {
  cuentaDebito: [
    {
      required: true,
      message: 'Cuenta no válida',
    },
  ],
  cuentaDebitoGastos: [
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
    moneda: [
      {
        required: true,
        message: 'Moneda no válida',
      },
    ],
    numeroCuenta: [
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
    moneda: [
      {
        required: true,
        message: 'Moneda no válida',
      },
    ],
    numeroCuenta: [
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
  const dispatch = useAppDispatch();

  const { title, form } = props;

  const nuevaSolicitud = useAppSelector((state: RootState) => state.transferencia.nuevaSolicitud);
  const shared = useAppSelector((state: RootState) => state.shared);

  // useEffects

  useEffect(() => {
    const currentActiveForm = nuevaSolicitud.ui.form.active;
    const currentStatus = nuevaSolicitud.ui.form.status.cuentas;
    if (currentActiveForm === FormNames.CUENTAS && currentStatus) {
      const { cuentaDebito, cuentaDebitoGastos, beneficiario } = nuevaSolicitud.data.form?.datosOperacion || {};
      form.resetFields();
      form.setFieldsValue({
        cuentaDebito: getOption(
          {
            id: cuentaDebito?.valor!,
            descripcion: cuentaDebito?.valor,
          },
          'descripcion',
        ),
        cuentaDebitoGastos: getOption(
          {
            id: cuentaDebitoGastos?.valor!,
            descripcion: cuentaDebitoGastos?.valor,
            //  descripcion: `${cuentaDebitoGastos?.codigo} | ${cuentaDebitoGastos?.monedaIso} | ${cuentaDebitoGastos?.numero}`,
          },
          'descripcion',
        ),
        cuentaDestino: beneficiario?.cuentaDestino,
        cuentaIntermediario: beneficiario?.cuentaIntermediario,
      });
    }
  }, [nuevaSolicitud.ui.form.active]);

  // handlers

  const handleOnFinish = () => {
    setData();
    dispatch(setEstadoForm({ cuentas: true }));
    dispatch(setActiveForm(FormNames.IMPORTES));
  };

  const setData = () => {
    const { cuentaDebito, cuentaDebitoGastos, cuentaDestino, cuentaIntermediario } = form.getFieldsValue() || {};
    dispatch(
      setDatosCuentas({
        cuentaDebito: nuevaSolicitud.info.cuentas?.value?.find((c) => c.id === cuentaDebito?.value)!,
        cuentaDebitoGastos: nuevaSolicitud.info.cuentas?.value?.find((c) => c.id === cuentaDebitoGastos?.value)!,
        cuentaDestino: cuentaDestino!,
        cuentaIntermediario: cuentaIntermediario!,
      }),
    );
  };

  // renders

  return (
    <>
      <Form className={styles.form} form={form} layout="vertical" onFinish={handleOnFinish}>
        <Form.Item>{renderFormTitle(title)}</Form.Item>
        <div style={{ overflowY: 'scroll', height: 600 }}>
          <Form.Item>{renderFormTitle('Cuentas Cliente', 16)}</Form.Item>

          <Row wrap={false}>
            <Space size={'middle'}>
              <Col style={{ width }}>
                <Form.Item label={Texts.ACCOUNT_SOURCE} name={'cuentaDebito'} rules={getRule(rules, 'cuentaDebito')} required>
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
                <Form.Item label={Texts.ACCOUNT_COMMISSIONS} name={'cuentaDebitoGastos'} rules={getRule(rules, 'cuentaDebitoGastos')} required>
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

          <Form.Item>{renderFormTitle('Cuenta Beneficiario', 16)}</Form.Item>

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
            </Space>
          </Row>

          <Row wrap={false}>
            <Space size={'middle'}>
              <Col style={{ width }}>
                <Form.Item label={Texts.ACCOUNT_NUMBER} name={['cuentaDestino', 'numeroCuenta']} rules={getRule(rules, ['cuentaDestino', 'numeroCuenta'])}>
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

              <Col style={{ width }}>
                <Form.Item label={Texts.BANK_CODE} name={['cuentaDestino', 'codigoBanco']} rules={getRule(rules, ['cuentaDestino', 'codigoBanco'])}>
                  <Input />
                </Form.Item>
              </Col>
            </Space>
          </Row>

          <Row wrap={false}>
            <Space size={'middle'}>
              <Col style={{ width }}>
                <Form.Item
                  label={Texts.BANK_CODE_TYPE}
                  name={['cuentaDestino', 'tipoCodigoBancoAdicional']}
                  rules={getRule(rules, ['cuentaDestino', 'tipoCodigoBancoAdicional'])}>
                  <Input />
                </Form.Item>
              </Col>

              <Col style={{ width }}>
                <Form.Item
                  label={Texts.BANK_CODE}
                  name={['cuentaDestino', 'codigoBancoAdicional']}
                  rules={getRule(rules, ['cuentaDestino', 'codigoBancoAdicional'])}>
                  <Input />
                </Form.Item>
              </Col>
            </Space>
          </Row>

          <Form.Item>{renderFormTitle('Cuenta Intermediario', 16)}</Form.Item>

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
                <Form.Item label={Texts.CURRENCY} name={['cuentaIntermediario', 'moneda']} rules={getRule(rules, ['cuentaIntermediario', 'moneda'])} required>
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
            </Space>
          </Row>

          <Row wrap={false}>
            <Space size={'middle'}>
              <Col style={{ width }}>
                <Form.Item
                  label={Texts.ACCOUNT_NUMBER}
                  name={['cuentaIntermediario', 'numeroCuenta']}
                  rules={getRule(rules, ['cuentaIntermediario', 'numeroCuenta'])}>
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

              <Col style={{ width }}>
                <Form.Item label={Texts.BANK_CODE} name={['cuentaIntermediario', 'codigoBanco']} rules={getRule(rules, ['cuentaIntermediario', 'codigoBanco'])}>
                  <Input />
                </Form.Item>
              </Col>
            </Space>
          </Row>

          <Row wrap={false}>
            <Space size={'middle'}>
              <Col style={{ width }}>
                <Form.Item
                  label={Texts.BANK_CODE_TYPE}
                  name={['cuentaIntermediario', 'tipoCodigoBancoAdicional']}
                  rules={getRule(rules, ['cuentaIntermediario', 'tipoCodigoBancoAdicional'])}>
                  <Input />
                </Form.Item>
              </Col>

              <Col style={{ width }}>
                <Form.Item
                  label={Texts.BANK_CODE}
                  name={['cuentaIntermediario', 'codigoBancoAdicional']}
                  rules={getRule(rules, ['cuentaIntermediario', 'codigoBancoAdicional'])}>
                  <Input />
                </Form.Item>
              </Col>
            </Space>
          </Row>
        </div>

        <Form.Item style={{ position: 'sticky', top: 550 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              Confirmar
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};
