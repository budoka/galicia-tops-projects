import { Button, Col, DatePicker, Form, Input, Row, Select, Space, Tabs, Typography } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import { ArgsProps } from 'antd/lib/message';
import { LabeledValue } from 'antd/lib/select';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/app/store';
import { useAppDispatch } from 'src/app/store/hooks';
import { DATE_DD_MM_YYYY_FORMAT, Pattern } from 'src/constants';
import { Texts } from 'src/constants/texts';
import { BeneficiarioForm, Pais, TipoPersonaObj, TransferenciaTabsNames } from 'src/features/transferencia/nueva-solicitud/data/types';
import { Rules } from 'src/types';
import { tiposPersona } from '..';
import { getOption, getRule, renderFormTitle, renderOptions } from '../../../../shared/ui/utils';
import { setActiveForm, setDatosBeneficiario, setEstadoForm } from '../../logic';
import styles from './style.module.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Link } = Typography;
const { TabPane } = Tabs;

const width = 250;

const reglas: Rules = {
  tipoPersona: [
    {
      required: true,
      message: 'Tipo de Persona no válida',
    },
  ],
  nombre: [
    {
      required: true,
      pattern: Pattern.ONLY_WORDS,
      message: 'Nombre no válido',
    },
  ],
  apellido: [
    {
      required: true,
      pattern: Pattern.ONLY_WORDS,
      message: 'Apellido no válido',
    },
  ],
  razonSocial: [
    {
      required: true,
      message: 'Razón Social no válida',
    },
  ],
  nif: [
    {
      required: false,
      message: 'NIF no válido',
    },
  ],
  fechaNacimiento: [
    {
      required: false,
      message: 'Fecha de Nacimiento no válida',
    },
  ],
  domicilio: {
    calle: [
      {
        required: true,
        message: 'Calle no válida',
      },
    ],
    numero: [
      {
        required: true,
        pattern: Pattern.ONLY_NUMBERS,
        message: 'Número no válido',
      },
    ],
    piso: [
      {
        required: false,
        pattern: Pattern.ONLY_NUMBERS,
        message: 'Piso no válido',
      },
    ],
    departamento: [
      {
        required: false,
        message: 'Departamento no válido',
      },
    ],
  },
  localidad: [
    {
      required: true,
      message: 'Localidad no válida',
    },
  ],
  codigoPostal: [
    {
      required: true,
      message: 'Código Postal no válido',
    },
  ],
  pais: [
    {
      required: true,
      message: 'País no válido',
    },
  ],
  banco: [
    {
      required: true,
      message: 'Banco no válido',
    },
  ],
};

const loadingMessage: ArgsProps = {
  key: 'loading',
  type: 'loading',
  content: 'Cargando...',
  duration: 0,
};

interface BeneficiarioFormPanelProps {
  title: string;
  form: FormInstance<BeneficiarioForm>;
}

const DEFAULT_PERSON_TYPE = getOption({ id: 'fisica', label: 'Física' }, 'label');
//const DEFAULT_PERSON_TYPE = { key: 'fisica', value: 'fisica', label: 'Física' };

export const BeneficiarioFormPanel: React.FC<BeneficiarioFormPanelProps> = (props) => {
  const dispatch = useAppDispatch();

  const { title, form } = props;

  const nuevaSolicitud = useSelector((state: RootState) => state.transferencias.nuevaSolicitud);

  const [currentTipoPersona, setCurrentTipoPersona] = useState<LabeledValue>(DEFAULT_PERSON_TYPE);

  // useEffects

  useEffect(() => {
    const currentActiveForm = nuevaSolicitud.ui.form.active;
    const currentStatus = nuevaSolicitud.ui.form.status.datosBeneficiario;
    if (currentActiveForm === TransferenciaTabsNames.DATOS_BENEFICIARIO && currentStatus) {
      const { tipoPersona, pais, fechaNacimiento, ...rest } = nuevaSolicitud.data.form?.datosOperacion?.beneficiario! || {};
      form.resetFields();
      form.setFieldsValue({
        ...rest,
        tipoPersona: getOption({ id: tipoPersona.id, descripcion: tipoPersona.descripcion }, 'descripcion'),
        pais: getOption({ id: pais.id, nombre: pais.nombre }, 'nombre'),
        fechaNacimiento: moment(fechaNacimiento),
      });

      setCurrentTipoPersona(form.getFieldsValue().tipoPersona);
    }
  }, [nuevaSolicitud.ui.form.active]);

  // handlers

  const handleOnTipoPersonaChange = () => {
    setCurrentTipoPersona(form.getFieldsValue().tipoPersona);
  };

  const handleOnFinish = () => {
    setData();
    dispatch(setEstadoForm({ datosBeneficiario: true }));
    dispatch(setActiveForm(TransferenciaTabsNames.GASTOS));
  };

  const setData = () => {
    const { tipoPersona, fechaNacimiento, pais, ...beneficiario } = form.getFieldsValue();
    dispatch(
      setDatosBeneficiario({
        ...beneficiario,
        tipoPersona: { id: tipoPersona.value, descripcion: tipoPersona.label } as TipoPersonaObj,
        fechaNacimiento: fechaNacimiento.toISOString(),
        pais: { id: pais.value, nombre: pais.label } as Pais,
      }),
    );
  };

  const test = () => {
    dispatch(setEstadoForm({ datosBeneficiario: true, datosClientes: true, datosIntermediarios: true }));
    //  dispatch(setActiveForm('3'));
  };

  const handleFill = () => {
    form.setFieldsValue({
      tipoPersona: DEFAULT_PERSON_TYPE,
      nombre: 'Juan',
      apellido: 'Gomez',
      nif: '12345',
      fechaNacimiento: moment('1993-06-11'),
      pais: getOption({ id: '236', label: 'Argentina' }, 'label'),
      domicilio: {
        calle: 'Av. Test',
        numero: 1234,
        piso: 10,
        departamento: 'A',
      },
      localidad: 'BS AS',
      codigoPostal: '2525',
    });

    console.log(form.getFieldsValue());
  };

  // renders

  return (
    <>
      <Form
        className={styles.form}
        form={form}
        layout="vertical"
        initialValues={{ tipoPersona: DEFAULT_PERSON_TYPE }}
        //  onFieldsChange={handleOnFieldsChange}

        onFinish={handleOnFinish}>
        <Form.Item>{renderFormTitle(title)}</Form.Item>

        <Row wrap={false}>
          <Space size={'middle'}>
            <Col style={{ width: width }}>
              <Form.Item label={Texts.PERSON_TYPE} name={'tipoPersona'} rules={getRule(reglas, 'tipoPersona')} required>
                <Select labelInValue placeholder={Texts.SELECT_PERSON_TYPE} onChange={handleOnTipoPersonaChange}>
                  {renderOptions(tiposPersona, 'descripcion')}
                </Select>
              </Form.Item>
            </Col>

            {'juridica' === currentTipoPersona.value ? (
              <Col style={{ width: width * 2 + 16 }}>
                <Form.Item label={Texts.NAME_BUSINESS_NAME} name={'razonSocial'} rules={getRule(reglas, 'razonSocial')} required>
                  <Input />
                </Form.Item>
              </Col>
            ) : (
              <>
                <Col style={{ width: width }}>
                  <Form.Item label={Texts.FIRST_NAME} name={'nombre'} rules={getRule(reglas, 'nombre')} required>
                    <Input />
                  </Form.Item>
                </Col>
                <Col style={{ width: width }}>
                  <Form.Item label={Texts.LAST_NAME} name={'apellido'} rules={getRule(reglas, 'apellido')} required>
                    <Input />
                  </Form.Item>
                </Col>
              </>
            )}
            {/*           <Col style={{ width: width }}>
              <Form.Item label={Texts.DATE} name={'fecha'} rules={reglas['fecha']} required>
                <DatePicker format={DATE_DD_MM_YYYY_FORMAT} placeholder={Texts.SELECT_DATE} showToday />
              </Form.Item>
            </Col> */}
            {/* 
            <Col style={{ width: width }}>
              <Form.Item label={Texts.ACCOUNT} name={['beneficiario', 'cuenta']} rules={reglas['cuentaBeneficiario']} required>
                <Input />
              </Form.Item>
            </Col> */}
          </Space>
        </Row>

        <Row wrap={false}>
          <Space size={'middle'}>
            <Col style={{ width: width }}>
              <Form.Item label={Texts.NIF} name={'nif'} rules={getRule(reglas, 'nif')}>
                <Input />
              </Form.Item>
            </Col>

            <Col style={{ width: width }}>
              <Form.Item label={Texts.DATE_BIRTH} name={'fechaNacimiento'} rules={getRule(reglas, 'fechaNacimiento')}>
                <DatePicker format={DATE_DD_MM_YYYY_FORMAT} placeholder={Texts.SELECT_DATE} showToday />
              </Form.Item>
            </Col>

            <Col style={{ width: width }}>
              <Form.Item label={Texts.COUNTRY} name={'pais'} rules={getRule(reglas, 'pais')} required>
                <Select
                  labelInValue
                  showSearch
                  optionFilterProp="children"
                  placeholder={Texts.SELECT_COUNTRY}
                  loading={nuevaSolicitud.info.paises?.loading}
                  disabled={nuevaSolicitud.info.paises?.loading}>
                  {renderOptions(nuevaSolicitud.info.paises?.value!, 'nombre')}
                </Select>
              </Form.Item>
            </Col>
          </Space>
        </Row>

        <Row wrap={false}>
          <Space size={'middle'}>
            <Col style={{ width: width }}>
              <Form.Item label={Texts.STREET} name={['domicilio', 'calle']} rules={getRule(reglas, ['domicilio', 'calle'])} required>
                <Input />
              </Form.Item>
            </Col>

            <Col style={{ width: width / 1.5 }}>
              <Form.Item label={Texts.NUMBER} name={['domicilio', 'numero']} rules={getRule(reglas, ['domicilio', 'numero'])} required>
                <Input />
              </Form.Item>
            </Col>

            <Col style={{ width: width / 1.5 - 8 }}>
              <Form.Item label={Texts.FLOOR} name={['domicilio', 'piso']} rules={getRule(reglas, ['domicilio', 'piso'])}>
                <Input />
              </Form.Item>
            </Col>

            <Col style={{ width: width / 1.5 - 8 }}>
              <Form.Item
                label={Texts.DEPARTMENT}
                name={['domicilio', 'departamento']}
                rules={getRule(reglas, ['domicilio', 'departamento'])}>
                <Input />
              </Form.Item>
            </Col>
          </Space>
        </Row>

        <Row wrap={false}>
          <Space size={'middle'}>
            {/*    <Col style={{ width: width }}>
              <Form.Item label={Texts.CURRENCY} name={'moneda'} rules={getRule(reglas, 'tipoPersona')} required>
                <Select
                  labelInValue
                  showSearch
                  optionFilterProp="children"
                  placeholder={Texts.SELECT_CURRENCY}
                  loading={nuevaSolicitud.info.monedas?.loading}
                  disabled={nuevaSolicitud.info.monedas?.loading}
                 
                >
                  {renderOptions(nuevaSolicitud.info.monedas?.value!, 'descripcion')}
                </Select>
              </Form.Item>
            </Col> */}

            <Col style={{ width: width }}>
              <Form.Item label={Texts.LOCALITY} name={'localidad'} rules={getRule(reglas, 'localidad')} required>
                <Input />
              </Form.Item>
            </Col>

            <Col style={{ width: width }}>
              <Form.Item label={Texts.ZIP_CODE} name={'codigoPostal'} rules={getRule(reglas, 'codigoPostal')} required>
                <Input />
              </Form.Item>
            </Col>
          </Space>
        </Row>

        <Form.Item style={{ position: 'sticky', top: 550 }} /* {...tailLayout} */>
          <Space>
            <Button type="primary" htmlType="submit">
              Confirmar
            </Button>
            <Button type="default" htmlType="button" onClick={test}>
              Test
            </Button>
            <Button type="link" htmlType="button" onClick={handleFill}>
              Completar
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
