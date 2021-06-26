import { unwrapResult } from '@reduxjs/toolkit';
import { Alert, Button, Carousel, Col, DatePicker, Divider, Form, Input, message, Row, Select, Space, Tabs, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { ArgsProps } from 'antd/lib/message';
import _ from 'lodash';
import React, { CSSProperties, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StateContext } from 'src/app';
import { LoadingContent } from 'src/components/loading';
import { Wrapper } from 'src/components/wrapper';
import { DATE_DD_MM_YYYY_FORMAT } from 'src/constants';
import { Texts } from 'src/constants/texts';
import { fetchConceptos, fetchCorresponsales, fetchProductos, fetchDatosClientes, fetchMonedas } from 'src/features/shared';
import { addTransferencia, clearForm, clearState, clearUI, setCuenta, setPersona } from 'src/features/transferencia/nueva-solicitud';
import { NuevaTransferenciaForm, ClienteForm } from 'src/features/transferencia/nueva-solicitud/types';
import { RootState } from 'src/reducers';
import { useAppDispatch } from 'src/store';
import { OpcionEx, Rules } from 'src/types';
import { getFreshToken } from 'src/utils/auth';
import { getViewWidth } from 'src/utils/screen';
import { interpolateString } from 'src/utils/string';
import { renderFormTitle, renderOptions } from '../utils';
import styles from './style.module.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Link } = Typography;
const { TabPane } = Tabs;

const width = 250;

const reglas: Rules = {
  cuit: [
    {
      required: true,
      message: 'CUIT no válido',
    },
  ],
  banco: [
    {
      required: true,
      message: 'Banco no válido',
    },
  ],
  cuentaBeneficiario: [
    {
      required: true,
      message: 'Cuenta no válida',
    },
  ],
  nombre: [
    {
      required: true,
      message: 'Nombre o Razón Social no válida',
    },
  ],
  fecha: [
    {
      required: true,
      message: 'Fecha no válida',
    },
  ],
  cuentaOrdenante: [
    {
      required: true,
      message: 'Cuenta no válida',
    },
  ],
  concepto: [
    {
      required: true,
      message: 'Concepto no válido',
    },
  ],
  corresponsal: [
    {
      required: true,
      message: 'Banco Corresponsal no válido',
    },
  ],
  tipoComision: [
    {
      required: true,
      message: 'Tipo de Comisión no válido',
    },
  ],
  moneda: [
    {
      required: true,
      message: 'Moneda no válida',
    },
  ],
  importe: [
    {
      required: true,
      pattern: /^[0-9]+(,[0-9]{1,2})?$/,
      message: 'Importe no válido',
    },
  ],
};

const loadingMessage: ArgsProps = {
  key: 'loading',
  type: 'loading',
  content: 'Cargando...',
  duration: 0,
};

export const IntermediariosFormPanel: React.FC = (props) => {
  const [transferenciaForm] = useForm<NuevaTransferenciaForm>();
  const [personaForm] = useForm<ClienteForm>();
  const state = useContext(StateContext);
  const dispatch = useAppDispatch();

  const nuevaTransferencia = useSelector((state: RootState) => state.transferencias.nuevaSolicitud);

  // useEffects

  useEffect(() => {}, []);

  // handlers

  const handleOnFinish = () => {};

  // renders

  const loadingContent = false; //ingresarCajas.loading.tiposCaja;

  return (
    <>
      <Form className={styles.form} form={transferenciaForm} name="nuevaTransferencia" layout="vertical" onFinish={handleOnFinish}>
        <Form.Item>{renderFormTitle('Datos del Beneficiario')}</Form.Item>

        <Row wrap={false}>
          <Space size={'middle'}>
            <Col style={{ width: width }}>
              <Form.Item label={Texts.NAME_BUSINESS_NAME} name={['beneficiario', 'nombre']} rules={reglas['nombre']} required>
                <Input />
              </Form.Item>
            </Col>

            <Col style={{ width: width }}>
              <Form.Item label={Texts.DATE} name={'fecha'} rules={reglas['fecha']} required>
                <DatePicker format={DATE_DD_MM_YYYY_FORMAT} placeholder={Texts.SELECT_DATE} showToday />
              </Form.Item>
            </Col>

            <Col style={{ width: width }}>
              <Form.Item label={Texts.ACCOUNT} name={['beneficiario', 'cuenta']} rules={reglas['cuentaBeneficiario']} required>
                <Input />
              </Form.Item>
            </Col>
          </Space>
        </Row>

        <Row wrap={false}>
          <Space size={'middle'}>
            <Col style={{ width: width }}>
              <Form.Item label={Texts.CONCEPT} name={'concepto'} rules={reglas['concepto']} required>
                <Select
                  labelInValue
                  showSearch
                  optionFilterProp="children"
                  placeholder={Texts.SELECT_CONCEPT}
                  loading={nuevaTransferencia.requiredData.conceptos?.loading}
                  disabled={nuevaTransferencia.requiredData.conceptos?.loading}

                  /* onChange={handleTipoCaja} */
                >
                  {renderOptions(nuevaTransferencia.requiredData.conceptos?.values)}
                </Select>
              </Form.Item>
            </Col>

            <Col style={{ width: width }}>
              <Form.Item label={Texts.CORRESPONDENT_BANK} name={'corresponsal'} rules={reglas['corresponsal']} required>
                <Select
                  labelInValue
                  showSearch
                  optionFilterProp="children"
                  placeholder={Texts.SELECT_CORRESPONDENT}
                  loading={nuevaTransferencia.requiredData.corresponsales?.loading}
                  disabled={nuevaTransferencia.requiredData.corresponsales?.loading}
                  /* onChange={handleTipoCaja} */
                >
                  {renderOptions(nuevaTransferencia.requiredData.corresponsales?.values)}
                </Select>
              </Form.Item>
            </Col>

            <Col style={{ width: width }}>
              <Form.Item label={Texts.FEE_TYPE} name={'tipoComision'} rules={reglas['tipoComision']} required>
                <Select
                  labelInValue
                  showSearch
                  optionFilterProp="children"
                  placeholder={Texts.SELECT_FEE_TYPE}
                  // loading={nuevaTransferencia.requiredData.tiposComisiones?.loading}
                  //disabled={nuevaTransferencia.requiredData.tiposComisiones?.loading}
                  /* onChange={handleTipoCaja} */
                >
                  {renderOptions([
                    { value: 'BEN', label: 'BEN' },
                    { value: 'OUR', label: 'OUR' },
                    { value: 'SHA', label: 'SHA' },
                  ])}
                </Select>
              </Form.Item>
            </Col>
          </Space>
        </Row>

        <Row wrap={false}>
          <Space size={'middle'}>
            <Col style={{ width: width }}>
              <Form.Item label={Texts.CURRENCY} name={'moneda'} rules={reglas['moneda']} required>
                <Select
                  labelInValue
                  showSearch
                  optionFilterProp="children"
                  placeholder={Texts.SELECT_CURRENCY}
                  loading={nuevaTransferencia.requiredData.monedas?.loading}
                  disabled={nuevaTransferencia.requiredData.monedas?.loading}
                  /* onChange={handleTipoCaja} */
                >
                  {renderOptions(nuevaTransferencia.requiredData.monedas?.values)}
                </Select>
              </Form.Item>
            </Col>
            <Col style={{ width: width }}>
              <Form.Item label={Texts.AMOUNT} name={'importe'} rules={reglas['importe']} required>
                <Input />
              </Form.Item>
            </Col>
          </Space>
        </Row>

        <Form.Item /* {...tailLayout} */>
          <Space>
            <Button type="primary" htmlType="submit">
              Confirmar
            </Button>

            {/*   <Button type="default" htmlType="button" onClick={handleReset}>
              Limpiar
            </Button>

            <Button type="link" htmlType="button" onClick={handleFill}>
              Completar
            </Button> */}
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};
