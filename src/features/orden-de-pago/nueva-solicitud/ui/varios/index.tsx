import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import moment from 'moment';
import React, { useEffect } from 'react';
import { RootState } from 'src/app/store';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import { DATE_DD_MM_YYYY_FORMAT } from 'src/constants';
import { Texts } from 'src/constants/texts';
import { Rules } from 'src/types/interfaces';
import { updateTry } from 'typescript';
import { detallesGastos } from '..';
import { getRule, getValueFromOptions, renderFormTitle, renderOptions } from '../../../../_shared/ui/utils';
import { FormNames, ImporteForm, VariosForm as VariosForm } from '../../data/forms';
import { DetalleGastos } from '../../data/interfaces';
import { setActiveForm, setDatosVarios, setEstadoForm } from '../../logic';
import styles from './style.module.less';

const width = 250;

const rules: Rules = {
  uetr: [
    {
      required: true,
      message: 'UETR no válido',
    },
  ],
  fechaEntrada: [
    {
      required: true,
      message: 'Fecha de Entrada no válida',
    },
  ],
  gastos: {
    detalle: [
      {
        required: true,
        message: 'Detalle no válido',
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
        message: 'Importe no válido',
      },
    ],
    swiftCorresponsal: [
      {
        required: true,
        message: 'Swift Corresponsal no válido',
      },
    ],
  },
};

interface VariosFormPanelProps {
  title: string;
  form: FormInstance<VariosForm>;
  importeForm: FormInstance<ImporteForm>;
}

export const VariosFormPanel: React.FC<VariosFormPanelProps> = (props) => {
  const { title, form, importeForm } = props;

  const dispatch = useAppDispatch();
  const nuevaSolicitud = useAppSelector((state: RootState) => state.ordenDePago.nuevaSolicitud);
  const shared = useAppSelector((state: RootState) => state.shared);

  //#region UseEffects

  useEffect(() => {
    const currentActiveForm = nuevaSolicitud.ui.form.active;
    const currentStatus = nuevaSolicitud.ui.form.status.varios;
    if (currentActiveForm === FormNames.VARIOS && currentStatus) {
      const { fechaEntrada, gastos } = nuevaSolicitud.data.form?.detalles || {};
      const uetr = nuevaSolicitud.data.form?.uetr;

      form.resetFields();
      form.setFieldsValue({
        uetr,
        fechaEntrada: moment(fechaEntrada),
        gastos: {
          ...gastos,
          detalle: getValueFromOptions(gastos?.detalle.id!, detallesGastos),
          moneda: getValueFromOptions(gastos?.moneda.id!, shared.monedas?.value!),
        },
      });
    }
  }, [nuevaSolicitud.ui.form.active]);

  //#endregion

  //#region Handlers

  const handleOnFinish = () => {
    setData();
    dispatch(setEstadoForm({ varios: true }));
    if (canAdvance('varios')) dispatch(setActiveForm(FormNames.CONFIRMACION));
  };

  //#endregion

  //#region Other functions

  const setData = () => {
    const { uetr, fechaEntrada, gastos } = form.getFieldsValue() || {};

    dispatch(
      setDatosVarios({
        uetr,
        fechaEntrada: fechaEntrada.toISOString(),
        gastos: {
          ...gastos,
          detalle: { id: gastos?.detalle?.value, descripcion: gastos?.detalle?.label } as DetalleGastos,
          moneda: { id: importeForm.getFieldsValue()?.moneda?.value?.toString(), descripcion: importeForm.getFieldsValue()?.moneda?.label?.toString()! },
          // moneda: { id: gastos?.moneda?.value?.toString(), descripcion: gastos?.moneda?.label?.toString()! },
        },
      }),
    );
  };

  const canAdvance = (omittedStatus: string) => {
    const status = nuevaSolicitud.ui.form.status;

    return Object.keys(status)
      .filter((key) => key !== omittedStatus)
      .every((key) => {
        return (status as any)[key] === true;
      });
  };

  //#endregion

  return (
    <>
      <Form className={styles.form} form={form} layout="vertical" onFinish={handleOnFinish}>
        <Form.Item>{renderFormTitle(title)}</Form.Item>

        <Row wrap={false}>
          <Space size={'middle'}>
            <Col style={{ width }}>
              <Form.Item label={Texts.UETR} name={'uetr'} rules={getRule(rules, 'uetr')} required>
                <Input />
              </Form.Item>
            </Col>

            <Col style={{ width }}>
              <Form.Item label={Texts.ENTRY_DATE} name={'fechaEntrada'} rules={getRule(rules, 'fechaEntrada')}>
                <DatePicker format={DATE_DD_MM_YYYY_FORMAT} placeholder={Texts.SELECT_DATE} />
              </Form.Item>
            </Col>

            <Col style={{ width }}>
              <Form.Item label={Texts.EXPENSE_DETAIL} name={['gastos', 'detalle']} rules={getRule(rules, ['gastos', 'detalle'])} required>
                <Select labelInValue placeholder={Texts.SELECT_EXPENSE_DETAIL}>
                  {renderOptions(detallesGastos, 'descripcion')}
                </Select>
              </Form.Item>
            </Col>
          </Space>
        </Row>

        <Row wrap={false}>
          <Space size={'middle'}>
            <Col style={{ width }}>
              <Form.Item
                label={Texts.CORRESPONDENT_SWIFT}
                name={['gastos', 'swiftCorresponsal']}
                rules={getRule(rules, ['gastos', 'swiftCorresponsal'])}
                required>
                <Input />
              </Form.Item>
            </Col>

            <Col style={{ width }}>
              <Form.Item label={Texts.CURRENCY}>
                <Input disabled={true} value={nuevaSolicitud.data.form?.detalles?.moneda ? `${nuevaSolicitud.data.form?.detalles?.moneda?.descripcion}` : ''} />
                {/*   <Select
                  labelInValue
                  showSearch
                  optionFilterProp="children"
                  placeholder={Texts.SELECT_CURRENCY}
                  loading={shared.monedas?.loading}
                  disabled={true}>
                  {renderOptions(shared.monedas?.value!, 'descripcion')}
                </Select> */}
              </Form.Item>
            </Col>

            <Col style={{ width }}>
              <Form.Item label={Texts.AMOUNT} name={['gastos', 'importe']} rules={getRule(rules, ['gastos', 'importe'])} required>
                <Input />
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
  );
};
