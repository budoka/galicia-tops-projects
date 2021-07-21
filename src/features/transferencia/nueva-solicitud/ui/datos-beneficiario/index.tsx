import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import { LabeledValue } from 'antd/lib/select';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { RootState } from 'src/app/store';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import { DATE_DD_MM_YYYY_FORMAT, Pattern } from 'src/constants';
import { Texts } from 'src/constants/texts';
import { Pais } from 'src/features/_shared/data/interfaces';
import { Rules } from 'src/types/interfaces';
import { tiposPersona } from '..';
import { getRule, getValueFromOptions, renderFormTitle, renderOptions } from '../../../../_shared/ui/utils';
import { BeneficiarioForm, FormNames } from '../../data/forms';
import { TipoPersona } from '../../data/interfaces';
import { setActiveForm, setDatosBeneficiario, setEstadoForm } from '../../logic';
import styles from './style.module.less';

const width = 250;

const rules: Rules = {
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
  tipoDocumento: [
    {
      required: false,
      message: 'Tipo de Documento no válido',
    },
  ],
  numeroDocumento: [
    {
      required: false,
      message: 'Número de Documento no válido',
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
      required: false,
      message: 'Localidad no válida',
    },
  ],
  codigoPostal: [
    {
      required: false,
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

interface BeneficiarioFormPanelProps {
  title: string;
  form: FormInstance<BeneficiarioForm>;
}

export const BeneficiarioFormPanel: React.FC<BeneficiarioFormPanelProps> = (props) => {
  const { title, form } = props;

  const dispatch = useAppDispatch();
  const nuevaSolicitud = useAppSelector((state: RootState) => state.transferencia.nuevaSolicitud);
  const shared = useAppSelector((state: RootState) => state.shared);

  const DEFAULT_PERSON_TYPE = getValueFromOptions('fisica', tiposPersona);

  const [currentTipoPersona, setCurrentTipoPersona] = useState<LabeledValue>(DEFAULT_PERSON_TYPE);

  //#region UseEffects

  useEffect(() => {
    const currentActiveForm = nuevaSolicitud.ui.form.active;
    const currentStatus = nuevaSolicitud.ui.form.status.datosBeneficiario;
    if (currentActiveForm === FormNames.DATOS_BENEFICIARIO && currentStatus) {
      const { tipoPersona, pais, fechaNacimiento, ...rest } = nuevaSolicitud.data.form?.datosOperacion?.beneficiario! || {};
      form.resetFields();
      form.setFieldsValue({
        ...rest,
        tipoPersona: getValueFromOptions(tipoPersona.id, tiposPersona),
        pais: getValueFromOptions(pais.id, shared?.paises?.value!),
        fechaNacimiento: moment(fechaNacimiento),
      });

      setCurrentTipoPersona(form.getFieldsValue().tipoPersona);
    }
  }, [nuevaSolicitud.ui.form.active]);

  //#endregion

  //#region Handlers

  const handleOnTipoPersonaChange = () => {
    setCurrentTipoPersona(form.getFieldsValue().tipoPersona);
  };

  const handleOnFinish = () => {
    setData();
    dispatch(setEstadoForm({ datosBeneficiario: true }));
    dispatch(setActiveForm(FormNames.CUENTAS));
  };

  const handleFill = () => {
    form.setFieldsValue({
      tipoPersona: getValueFromOptions('fisica', tiposPersona),
      nombre: 'Juan',
      apellido: 'Gomez',
      nif: '12345',
      fechaNacimiento: moment('1993-06-11'),
      pais: getValueFromOptions('AR', shared.paises?.value!),
      tipoDocumento: 'ASD',
      numeroDocumento: '123XXX456',
      domicilio: {
        calle: 'Av. Test',
        numero: 1234,
        piso: 10,
        departamento: 'A',
      },
      localidad: 'BS AS',
      codigoPostal: '2525',
    });
  };

  //#endregion

  //#region Other functions

  const setData = () => {
    const { tipoPersona, fechaNacimiento, pais, ...beneficiario } = form.getFieldsValue() || {};
    dispatch(
      setDatosBeneficiario({
        ...beneficiario,
        tipoPersona: { id: tipoPersona.value, descripcion: tipoPersona.label } as TipoPersona,
        fechaNacimiento: fechaNacimiento.toISOString(true),
        pais: { id: pais.value, nombre: pais.label } as Pais,
      }),
    );
  };

  //#endregion

  return (
    <>
      <Form className={styles.form} form={form} layout="vertical" initialValues={{ tipoPersona: DEFAULT_PERSON_TYPE }} onFinish={handleOnFinish}>
        <Form.Item>{renderFormTitle(title)}</Form.Item>

        <Row wrap={false}>
          <Space size={'middle'}>
            <Col style={{ width }}>
              <Form.Item label={Texts.PERSON_TYPE} name={'tipoPersona'} rules={getRule(rules, 'tipoPersona')} required>
                <Select labelInValue placeholder={Texts.SELECT_PERSON_TYPE} onChange={handleOnTipoPersonaChange}>
                  {renderOptions(tiposPersona, { labelKey: 'descripcion' })}
                </Select>
              </Form.Item>
            </Col>

            {'juridica' === currentTipoPersona.value ? (
              <Col style={{ width: width * 2 + 16 }}>
                <Form.Item label={Texts.NAME_BUSINESS_NAME} name={'razonSocial'} rules={getRule(rules, 'razonSocial')} required>
                  <Input />
                </Form.Item>
              </Col>
            ) : (
              <>
                <Col style={{ width }}>
                  <Form.Item label={Texts.FIRST_NAME} name={'nombre'} rules={getRule(rules, 'nombre')} required>
                    <Input />
                  </Form.Item>
                </Col>
                <Col style={{ width }}>
                  <Form.Item label={Texts.LAST_NAME} name={'apellido'} rules={getRule(rules, 'apellido')} required>
                    <Input />
                  </Form.Item>
                </Col>
              </>
            )}
          </Space>
        </Row>

        <Row wrap={false}>
          <Space size={'middle'}>
            <Col style={{ width }}>
              <Form.Item label={Texts.DOCUMENT_TYPE} name={'tipoDocumento'} rules={getRule(rules, 'tipoDocumento')}>
                <Input />
              </Form.Item>
            </Col>

            <Col style={{ width }}>
              <Form.Item label={Texts.DOCUMENT_NUMBER} name={'numeroDocumento'} rules={getRule(rules, 'numeroDocumento')}>
                <Input />
              </Form.Item>
            </Col>

            <Col style={{ width }}>
              <Form.Item label={Texts.NIF} name={'nif'} rules={getRule(rules, 'nif')}>
                <Input />
              </Form.Item>
            </Col>
          </Space>
        </Row>

        <Row wrap={false}>
          <Space size={'middle'}>
            <Col style={{ width }}>
              <Form.Item label={Texts.DATE_BIRTH} name={'fechaNacimiento'} rules={getRule(rules, 'fechaNacimiento')}>
                <DatePicker format={DATE_DD_MM_YYYY_FORMAT} placeholder={Texts.SELECT_DATE} />
              </Form.Item>
            </Col>

            <Col style={{ width }}>
              <Form.Item label={Texts.STREET} name={['domicilio', 'calle']} rules={getRule(rules, ['domicilio', 'calle'])} required>
                <Input />
              </Form.Item>
            </Col>

            <Col style={{ width }}>
              <Form.Item label={Texts.NUMBER} name={['domicilio', 'numero']} rules={getRule(rules, ['domicilio', 'numero'])} required>
                <Input />
              </Form.Item>
            </Col>
          </Space>
        </Row>

        <Row wrap={false}>
          <Space size={'middle'}>
            <Col style={{ width }}>
              <Form.Item label={Texts.FLOOR} name={['domicilio', 'piso']} rules={getRule(rules, ['domicilio', 'piso'])}>
                <Input />
              </Form.Item>
            </Col>

            <Col style={{ width }}>
              <Form.Item label={Texts.DEPARTMENT} name={['domicilio', 'departamento']} rules={getRule(rules, ['domicilio', 'departamento'])}>
                <Input />
              </Form.Item>
            </Col>

            <Col style={{ width: width }}>
              <Form.Item label={Texts.LOCALITY} name={'localidad'} rules={getRule(rules, 'localidad')}>
                <Input />
              </Form.Item>
            </Col>
          </Space>
        </Row>

        <Row wrap={false}>
          <Space size={'middle'}>
            <Col style={{ width }}>
              <Form.Item label={Texts.ZIP_CODE} name={'codigoPostal'} rules={getRule(rules, 'codigoPostal')}>
                <Input />
              </Form.Item>
            </Col>

            <Col style={{ width }}>
              <Form.Item label={Texts.COUNTRY} name={'pais'} rules={getRule(rules, 'pais')} required>
                <Select
                  labelInValue
                  showSearch
                  optionFilterProp="children"
                  placeholder={Texts.SELECT_COUNTRY}
                  loading={shared.paises?.loading}
                  disabled={shared.paises?.loading}>
                  {renderOptions(shared.paises?.value!, { labelKey: 'nombre' })}
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
            <Button type="link" htmlType="button" onClick={handleFill}>
              Completar
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};
