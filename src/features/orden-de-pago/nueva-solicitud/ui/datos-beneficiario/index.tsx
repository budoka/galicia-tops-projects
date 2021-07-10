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
import { OrdenanteForm, FormNames } from '../../data/forms';
import { TipoPersona } from '../../data/interfaces';
import { setActiveForm, setDatosOrdenante, setEstadoForm } from '../../logic';
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
  pais: [
    {
      required: true,
      message: 'País no válido',
    },
  ],
};

interface BeneficiarioFormPanelProps {
  title: string;
  form: FormInstance<OrdenanteForm>;
}

export const BeneficiarioFormPanel: React.FC<BeneficiarioFormPanelProps> = (props) => {
  const { title, form } = props;

  const dispatch = useAppDispatch();
  const nuevaSolicitud = useAppSelector((state: RootState) => state.ordenDePago.nuevaSolicitud);
  const shared = useAppSelector((state: RootState) => state.shared);

  const DEFAULT_PERSON_TYPE = getValueFromOptions('fisica', tiposPersona);

  const [currentTipoPersona, setCurrentTipoPersona] = useState<LabeledValue>(DEFAULT_PERSON_TYPE);

  //#region UseEffects

  useEffect(() => {
    const currentActiveForm = nuevaSolicitud.ui.form.active;
    const currentStatus = nuevaSolicitud.ui.form.status.datosOrdenante;
    if (currentActiveForm === FormNames.DATOS_ORDENANTE && currentStatus) {
      const { tipoPersona, pais, ...rest } = nuevaSolicitud.data.form?.detalles?.ordenante! || {};
      form.resetFields();
      form.setFieldsValue({
        ...rest,
        tipoPersona: getValueFromOptions(tipoPersona.id, tiposPersona),
        pais: getValueFromOptions(pais.id, shared?.paises?.value!),
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
    dispatch(setEstadoForm({ datosOrdenante: true }));
    dispatch(setActiveForm(FormNames.CUENTAS));
  };

  const handleFill = () => {
    form.setFieldsValue({
      tipoPersona: getValueFromOptions('fisica', tiposPersona),
      nombre: 'Juan',
      apellido: 'Gomez',
      pais: getValueFromOptions('AR', shared.paises?.value!),
    });

    console.log(form.getFieldsValue());
  };

  //#endregion

  //#region Other functions

  const setData = () => {
    const { tipoPersona, pais, ...beneficiario } = form.getFieldsValue() || {};
    dispatch(
      setDatosOrdenante({
        ...beneficiario,
        tipoPersona: { id: tipoPersona.value, descripcion: tipoPersona.label } as TipoPersona,
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
                  {renderOptions(tiposPersona, 'descripcion')}
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
              <Form.Item label={Texts.COUNTRY} name={'pais'} rules={getRule(rules, 'pais')} required>
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
