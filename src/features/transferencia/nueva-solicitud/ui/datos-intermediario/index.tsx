import { Button, Col, DatePicker, Form, Input, Row, Select, Space, Tabs, Typography } from 'antd';
import { FormInstance, useForm } from 'antd/lib/form/Form';
import { ArgsProps } from 'antd/lib/message';
import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StateContext } from 'src/app';
import { RootState } from 'src/app/store';
import { useAppDispatch } from 'src/app/store/hooks';
import { DATE_DD_MM_YYYY_FORMAT } from 'src/constants';
import { Texts } from 'src/constants/texts';
import { DetalleGasto } from 'src/features/shared/data/types';
import { NuevaSolicitudFormState } from 'src/features/transferencia/nueva-solicitud/data/types';
import { Rules } from 'src/types';
import { detalleGasto } from '..';
import { renderFormTitle, renderOptions } from '../../../../shared/ui/utils';
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

interface IntermediariosFormPanelProps {
  form: FormInstance<NuevaSolicitudFormState>;
}

export const IntermediariosFormPanel: React.FC<IntermediariosFormPanelProps> = (props) => {
  const { form } = props;

  const nuevaSolicitud = useSelector((state: RootState) => state.transferencias.nuevaSolicitud);

  // useEffects

  useEffect(() => {}, []);

  // handlers

  const handleOnFinish = () => {};

  // renders

  const loadingContent = false; //ingresarCajas.loading.tiposCaja;

  return (
    <>
      <Form className={styles.form} form={form} name="nuevaTransferencia" layout="vertical" onFinish={handleOnFinish}>
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
                  loading={nuevaSolicitud.info.conceptos?.loading}
                  disabled={nuevaSolicitud.info.conceptos?.loading}

                  /* onChange={handleTipoCaja} */
                >
                  {renderOptions(nuevaSolicitud.info.conceptos?.value!, 'codigo')}
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
                  loading={nuevaSolicitud.info.corresponsales?.loading}
                  disabled={nuevaSolicitud.info.corresponsales?.loading}
                  /* onChange={handleTipoCaja} */
                >
                  {renderOptions(nuevaSolicitud.info.corresponsales?.value!, 'codigo')}
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
                  {renderOptions(detalleGasto)}
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
                  loading={nuevaSolicitud.info.monedas?.loading}
                  disabled={nuevaSolicitud.info.monedas?.loading}
                  /* onChange={handleTipoCaja} */
                >
                  {renderOptions(nuevaSolicitud.info.monedas?.value!, 'descripcion')}
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
