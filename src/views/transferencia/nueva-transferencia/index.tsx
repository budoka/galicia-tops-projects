import { unwrapResult } from '@reduxjs/toolkit';
import { Alert, Button, Col, DatePicker, Divider, Form, Input, message, Row, Select, Space, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { ArgsProps } from 'antd/lib/message';
import _ from 'lodash';
import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StateContext } from 'src/app';
import { LoadingContent } from 'src/components/loading';
import { Wrapper } from 'src/components/wrapper';
import { DATE_DD_MM_YYYY_FORMAT, TipoPersona } from 'src/constants';
import { Texts } from 'src/constants/texts';
import { fetchConceptos, fetchCorresponsales, fetchProductos, fetchDatosPersonas, fetchMonedas } from 'src/features/shared';
import { addTransferencia, clearForm, clearState, clearUI, setCuenta, setPersona } from 'src/features/transferencias/nueva-transferencia';
import { NuevaTransferenciaForm, PersonaForm } from 'src/features/transferencias/nueva-transferencia/types';
import { RootState } from 'src/reducers';
import { useAppDispatch } from 'src/store';
import { OpcionEx, Rules } from 'src/types';
import { getFreshToken } from 'src/utils/auth';
import { interpolateString } from 'src/utils/string';
import styles from './style.module.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Link } = Typography;

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

export const NuevaTransferencia: React.FC = (props) => {
  const [transferenciaForm] = useForm<NuevaTransferenciaForm>();
  const [personaForm] = useForm<PersonaForm>();
  const state = useContext(StateContext);
  const dispatch = useAppDispatch();

  const nuevaTransferencia = useSelector((state: RootState) => state.transferencias.nuevaTransferencia);

  // useEffects

  useEffect(() => {
    const fetchData = async () => {
      const token = await getFreshToken(state.msalInstance!);

      dispatch(
        fetchMonedas({
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }),
      );

      dispatch(
        fetchCorresponsales({
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }),
      );

      dispatch(
        fetchConceptos({
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }),
      );

      return () => {
        dispatch(clearState());
      };
    };

    //

    fetchData();
  }, []);

  // handlers

  /*   const handleTipoCaja = () => {
    const tipoCaja: Filtro = form.getFieldsValue().tipoCaja!;

    const fieldsToReset = ['tipoContenido', 'tipoPlantilla', 'fechaContenido', 'descripcion', 'restringida'];
    form.resetFields(fieldsToReset);
  };
 */

  useEffect(() => {
    if (nuevaTransferencia.form.loading || nuevaTransferencia.requiredData.personas?.loading) message.loading(loadingMessage);
  }, [nuevaTransferencia.form.loading, nuevaTransferencia.requiredData.persona]);

  useEffect(() => {
    const persona = nuevaTransferencia.requiredData.persona;
    if (persona) {
      const { idHost } = persona;
      dispatch(fetchProductos({ params: { idHost, productos: 'CA,CC' } }))
        .then(unwrapResult)
        .then((infoProductos) => {
          console.log(infoProductos);
          const { productos } = infoProductos;
          const { cuentas } = productos;
          const count = cuentas?.length;
          /*  console.log(count);
          if (count > 1) {
            dispatch(setCuenta(cuentas[0]));
          }*/
        });
    }
  }, [nuevaTransferencia.requiredData.persona]);

  const handlePersonaForm = (values: PersonaForm) => {
    console.log(values);
    dispatch(fetchDatosPersonas({ params: { filtro: 'CUIT', valor: values.cuit } }))
      .then(unwrapResult)
      .then((personas) => {
        const count = personas.length;
        console.log(count);
        if (count === 1) {
          dispatch(setPersona(personas[0]));
          message.success({ key: 'loading', content: Texts.SEARCH_PERSON_OK, duration: 3 });
        } else {
          message.success({
            key: 'loading',
            content: interpolateString(Texts.SEARCH_PERSON_OK_MULTIPLE_RESULTS, [count]),
            duration: 3,
          });
        }
      })
      .catch((err) => {
        message.error({ key: 'loading', content: Texts.SEARCH_PERSON_ERROR, duration: 3 });
      });
  };

  const handleNuevaTransferenciaForm = (values: NuevaTransferenciaForm) => {
    dispatch(addTransferencia({ data: values }))
      .then(unwrapResult)
      .then(() => {
        message.success({ key: 'loading', content: Texts.TRANSFER_CREATION_OK, duration: 3 });
      })
      .catch((err) => {
        message.error({ key: 'loading', content: Texts.TRANSFER_CREATION_ERROR, duration: 3 });
      });
  };

  const handleReset = () => {
    personaForm.resetFields();
    transferenciaForm.resetFields();
    dispatch(clearUI());
    dispatch(clearForm());
  };

  const handleFill = () => {
    personaForm.setFieldsValue({ cuit: '30612732503' });
    transferenciaForm.setFieldsValue({
      ordenante: {
        banco: 'Any Bank',
        cuenta: '0000-1111-2222',
      },
      beneficiario: {
        nombre: 'Pepe SRL',
        cuenta: '9999-8888-7777',
      },
      importe: 10000,
      tipoComision: {
        value: 'BEN',
        label: 'BEN',
      },
    });

    console.log(personaForm.getFieldsValue());
    console.log(transferenciaForm.getFieldsValue());
  };

  // renders

  const renderOptionsEx = (options?: OpcionEx[]) => {
    if (!options) return;

    return options.map((option, index) => (
      <Option key={option.value} value={option.value}>
        {option.label}
      </Option>
    ));
  };

  const renderDatosPersona = () => {
    const persona = nuevaTransferencia.requiredData.persona;

    if (!persona || _.isEmpty(persona)) return undefined;

    const datosFisico = `${persona.apellido}, ${persona.nombre}}`;
    const datosJuridica = `${persona.razonSocial}`;

    return (
      <Alert
        type="success"
        showIcon
        style={{ fontWeight: 'bold' }}
        message={persona.tipo === TipoPersona.JURIDICA ? datosJuridica : datosFisico}
      />
    );
  };

  const renderFormTitle = (title: string) => {
    return (
      <Text style={{ fontSize: 18 }} strong>
        {title}
      </Text>
    );
  };

  const renderOrdenanteForm = () => {
    return (
      <>
        <Form className={styles.form} form={personaForm} name="persona" layout="vertical" onFinish={handlePersonaForm}>
          <Form.Item> {renderFormTitle('Datos del Ordenante')} </Form.Item>
          <Form.Item>
            <Space size={'middle'}>
              <Form.Item label={Texts.CUIT} name={'cuit'} rules={reglas['cuit']} required>
                <Input disabled={nuevaTransferencia.requiredData.personas?.loading} />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={nuevaTransferencia.requiredData.personas?.loading}
                loading={nuevaTransferencia.requiredData.personas?.loading}
                style={{ marginTop: 5 }}>
                {nuevaTransferencia.requiredData.personas?.loading ? 'Buscando' : 'Buscar'}
              </Button>
            </Space>
          </Form.Item>
          <Form.Item>{renderDatosPersona()}</Form.Item>
        </Form>

        {nuevaTransferencia.requiredData.persona && (
          <Form className={styles.form} form={transferenciaForm} name="nuevaTransferencia" layout="vertical">
            {/*   <Form.Item label={Texts.BANK} name={['ordenante', 'banco']} rules={reglas['banco']} required>
            <Input />
          </Form.Item> */}
            <Form.Item label={Texts.ACCOUNT} name={['ordenante', 'cuenta']} rules={reglas['cuentaOrdenante']} required>
              <Select
                labelInValue
                //optionFilterProp="children"
                // filterOption={(input, option) => option && option.value && option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                placeholder={Texts.SELECT_ACCOUNT}
                loading={nuevaTransferencia.requiredData.infoProductos?.loading}
                disabled={nuevaTransferencia.requiredData.infoProductos?.loading}

                /* onChange={handleTipoCaja} */
              >
                {renderOptionsEx(nuevaTransferencia.requiredData.infoProductos?.values?.productos?.cuentas)}
              </Select>
            </Form.Item>
          </Form>
        )}
      </>
    );
  };

  const renderBeneficiarioForm = () => {
    return (
      <>
        <Form
          className={styles.form}
          form={transferenciaForm}
          name="nuevaTransferencia"
          layout="vertical"
          onFinish={handleNuevaTransferenciaForm}>
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
                    {renderOptionsEx(nuevaTransferencia.requiredData.conceptos?.values)}
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
                    {renderOptionsEx(nuevaTransferencia.requiredData.corresponsales?.values)}
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
                    {renderOptionsEx([
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
                    {renderOptionsEx(nuevaTransferencia.requiredData.monedas?.values)}
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

              <Button type="default" htmlType="button" onClick={handleReset}>
                Limpiar
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

  const loadingContent = false; //ingresarCajas.loading.tiposCaja;

  return (
    <Wrapper contentWrapper unselectable direction="column" horizontal="left" style={{ width: loadingContent ? '100%' : 1250 }}>
      {loadingContent ? (
        <LoadingContent />
      ) : (
        <>
          <Row style={{ height: '100%' }}>
            <Col
              style={{
                display: 'flex',
                flex: '1',
                flexDirection: 'column',
                padding: '0 20px',
              }} /* span={layout.formCol.span} offset={layout.formCol.offset} */
            >
              {renderOrdenanteForm()}
            </Col>
            <Col /* span={2} */ style={{ display: 'flex', justifyContent: 'center' }}>
              <Divider style={{ height: '100%', margin: '0 20px' }} type="vertical" />
            </Col>
            <Col style={{ display: 'flex', flex: '1', padding: '0 20px' }} /* span={layout.formCol.span} offset={layout.formCol.offset} */>
              {renderBeneficiarioForm()}
            </Col>
          </Row>
        </>
      )}
    </Wrapper>
  );
};
