import { unwrapResult } from '@reduxjs/toolkit';
import { Button, Col, Collapse, DatePicker, Form, Input, message, Row, Select, Space } from 'antd';
import locale from 'antd/lib/date-picker/locale/es_ES';
import { useForm } from 'antd/lib/form/Form';
import _ from 'lodash';
import moment from 'moment';
import { ColumnsType } from 'rc-table/lib/interface';
import React, { CSSProperties, useContext, useEffect } from 'react';
import { StateContext } from 'src/app';
import { RootState } from 'src/app/store';
import { useAppDispatch, useAppSelector } from 'src/app/store/hooks';
import { LoadingContent } from 'src/components/loading';
import { ServiceError } from 'src/components/service-error';
import { ColumnTypeEx, Table } from 'src/components/table';
import { Wrapper } from 'src/components/wrapper';
import { Texts } from 'src/constants/texts';
import { addSolicitud, cleanState } from 'src/features/transferencia/nueva-solicitud/logic';
import { fetchMonedas } from 'src/features/_shared/logic';
import { getRule } from 'src/features/_shared/ui/utils';
import { Rules } from 'src/types/interfaces';
import { getFreshToken } from 'src/utils/auth';
import { formatCurrencyAmount, formatDate } from 'src/utils/formatters';
import { getViewWidth } from 'src/utils/screen';
import { compare } from 'src/utils/string';
import { FiltrosForm } from '../data/forms';
import { Mensaje } from '../data/interfaces';
import { fetchMensajes } from '../logic';
import styles from './style.module.less';

interface Item {
  label: string;
  value: string;
  parent?: string;
}

interface TableFilter {
  key: string;
  title: React.ReactNode;
  type: FilterType;
  items?: Item[];
  value?: string | number;
  onChange?: Function;
}

type FilterType = 'text' | 'date' | 'date-range' | 'list';

const filtros: TableFilter[] = [
  {
    key: 'fecha',
    title: 'Fecha',
    type: 'date-range',
  },
  {
    key: 'ordenante',
    title: 'Ordenante',
    type: 'text',
  },
  {
    key: 'beneficiario',
    title: 'Beneficiario',
    type: 'text',
  },
  {
    key: 'moneda',
    title: 'Moneda',
    type: 'list',
    items: [],
  },
  {
    key: 'importeMinimo',
    title: 'Importe mínimo',
    type: 'text',
  },
  {
    key: 'importeMaximo',
    title: 'Importe máximo',
    type: 'text',
  },
  {
    key: 'tipo',
    title: 'Tipo',
    type: 'list',
    items: [{ label: 'MT 103', value: '103' }],
  },
  {
    key: 'uetr',
    title: 'UETR',
    type: 'text',
  },
  {
    key: 'referencia',
    title: 'Referencia',
    type: 'text',
  },
];

const { Option } = Select;

const width = 250;

const rules: Rules = {
  fecha: [
    {
      required: false,
      message: 'Fecha no válida',
    },
  ],
  ordenante: [
    {
      required: false,
      message: 'Ordenante no válido',
    },
  ],
  beneficiario: [
    {
      required: false,
      message: 'Beneficiario no válido',
    },
  ],
  moneda: [
    {
      required: false,
      message: 'Moneda no válida',
    },
  ],
  importeMinimo: [
    {
      required: false,
      pattern: /^[0-9]+(,[0-9]{1,2})?$/,
      message: 'Importe no válido',
    },
  ],
  importeMaximo: [
    {
      required: false,
      pattern: /^[0-9]+(,[0-9]{1,2})?$/,
      message: 'Importe no válido',
    },
  ],
  uetr: [
    {
      required: false,
      message: 'UETR no válido',
    },
  ],
  referencia: [
    {
      required: false,
      message: 'Referencia no válida',
    },
  ],
  tipo: [
    {
      required: false,
      message: 'Tipo no válido',
    },
  ],
};

const columns = [
  {
    key: 'id',
    dataIndex: 'id',
    title: Texts.ID,
    width: 100,
    sorter: { compare: (a, b) => compare(+a.id, +b.id), multiple: -1 },
  },
  {
    key: 'tipo',
    dataIndex: 'tipo',
    title: Texts.TYPE,
    width: 100,
    sorter: { compare: (a, b) => compare(+a.tipo, +b.tipo), multiple: -1 },
  },
  {
    key: 'fecha',
    dataIndex: 'fecha',
    title: Texts.DATE,
    width: 200,
    sorter: { compare: (a, b) => compare(a.fecha, b.fecha), multiple: -1 },
    render: (value, record, index) => formatDate(record.fecha, 'DD/MM/YYYY hh:mm'),
  },
  {
    key: 'ordenante',
    dataIndex: 'ordenante',
    title: Texts.ORIGINATOR,
    width: 250,
    sorter: { compare: (a, b) => compare(a.ordenante, b.ordenante), multiple: -1 },
  },
  {
    key: 'beneficiario',
    dataIndex: 'beneficiario',
    title: Texts.BENEFICIARY,
    width: 250,
    sorter: { compare: (a, b) => compare(a.beneficiario, b.beneficiario), multiple: -1 },
  },
  {
    key: 'importe',
    dataIndex: 'importe',
    title: Texts.AMOUNT,
    width: 200,
    sorter: { compare: (a, b) => compare(+a.importe, +b.importe), multiple: -1 },

    render: (value, record, index) => formatCurrencyAmount(record.importe, record.moneda),
  },
  {
    key: 'estado',
    dataIndex: 'estado',
    title: Texts.STATUS,
    width: 100,
    sorter: { compare: (a, b) => compare(a.estado, b.estado), multiple: -1 },
  },
] as ColumnTypeEx<Mensaje>[];

export const ListaMensajes: React.FC = (props) => {
  const [busquedaForm] = useForm<FiltrosForm>();

  const state = useContext(StateContext);
  const dispatch = useAppDispatch();

  const listaMensajes = useAppSelector((state: RootState) => state.mensaje.listaMensajes);

  // useEffects

  useEffect(() => {
    const fetchData = async () => {
      const token = await getFreshToken(state.msalInstance!);

      dispatch(
        fetchMensajes({
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }),
      );

      dispatch(
        fetchMonedas({
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }),
      );

      return () => {
        dispatch(cleanState());
      };
    };

    fetchData();
  }, []);

  //#region Handlers

  const handleNuevaTransferenciaForm = (values: any) => {
    dispatch(addSolicitud({ body: values }))
      .then(unwrapResult)
      .then(() => {
        message.success({ key: 'loading', content: Texts.TRANSFER_CREATION_OK, duration: 3 });
      })
      .catch((err) => {
        message.error({ key: 'loading', content: Texts.TRANSFER_CREATION_ERROR, duration: 3 });
      });
  };

  const handleOnFinish = () => {
    setData();
  };

  const setData = () => {
    const {} = busquedaForm.getFieldsValue();
    // dispatch(setFiltros(filtros));
  };

  const handleReset = () => {
    //   clienteForm.resetFields();
    //  transferenciaForm.resetFields();
    /*     dispatch(clearUI());
    dispatch(clearForm()); */
  };

  //#endregion

  //#region Other functions

  const isConfirmationEnabled = () => {
    const status = listaMensajes.ui.list.status;
    return Object.values(status).every((s) => {
      return s === true;
    });
  };

  const isFetchingData = () => {
    const info = listaMensajes.info;

    return (
      Object.entries(info)
        // .filter((entry) => !['clientes', 'cuentas'].includes(entry[0]))
        .some((entry) => {
          return entry[1]?.loading;
        })
    );
  };

  const hasError = () => {
    const info = listaMensajes.info;

    return (
      Object.entries(info)
        // .filter((entry) => !['clientes', 'cuentas'].includes(entry[0]))
        .some((entry) => {
          return entry[1]?.error;
        })
    );
  };

  //#endregion

  const isContentLoading = isFetchingData();

  const hasContentError = hasError();

  //#region Renders

  const renderListFilter = (filter: TableFilter, style?: CSSProperties, mode?: 'multiple' | 'tags') => {
    const { key, title, items, onChange } = filter;

    return (
      <Form.Item key={key} name={key} label={title} style={style} rules={getRule(rules, key)}>
        <Select mode={mode} allowClear>
          {items!.map((item, index) => (
            <Option key={index} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    );
  };

  const renderDateFilter = (filter: TableFilter, style?: CSSProperties) => {
    const { key, title } = filter;

    return (
      <Form.Item key={key} name={key} label={title} style={style} rules={getRule(rules, key)}>
        <DatePicker format="DD/MM/YYYY" locale={locale} style={{ width: '100%' }} />
      </Form.Item>
    );
  };

  const renderDateRangeFilter = (filter: TableFilter, style?: CSSProperties) => {
    const { key, title } = filter;

    return (
      <Form.Item key={key} name={key} label={title} style={style} rules={getRule(rules, key)}>
        <DatePicker.RangePicker
          format="DD/MM/YYYY"
          locale={locale}
          placeholder={['Fecha desde', 'Fecha hasta']}
          ranges={{
            Hoy: [moment().startOf('day'), moment().endOf('day')],
            'Este Mes': [moment().startOf('month'), moment().endOf('month')],
          }}
          style={{ width: '100%' }}
        />
      </Form.Item>
    );
  };

  const renderInputTextFilter = (filter: TableFilter, style?: CSSProperties) => {
    const { key, title } = filter;

    return (
      <Form.Item key={key} name={key} label={title} style={style} rules={getRule(rules, key)}>
        <Input style={{ width: '100%' }} />
      </Form.Item>
    );
  };

  const renderFilter = (filter: TableFilter) => {
    const type = filter.type;
    const style: CSSProperties = { marginRight: 10, marginBottom: 0, width: 'auto' };

    switch (type) {
      case 'text':
        return renderInputTextFilter(filter, style);
      case 'date':
        return renderDateFilter(filter, style);
      case 'date-range':
        return renderDateRangeFilter(filter, style);
      case 'list':
        return renderListFilter(filter, { ...style /*width: '260px'*/ });
      default:
        break;
    }
  };

  const renderFilters = () => {
    const chunks = _.chunk(filtros, 3);
    return (
      <Form form={busquedaForm} style={{ width: '100%' }} onFinish={handleOnFinish}>
        <Row style={{ alignItems: 'flex-start' }}>
          {chunks.map((filtros, index) => {
            return (
              <Col
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  width: `calc(100%/${chunks.length})`,
                  minWidth: 300,
                }}>
                <Space size={'middle'} direction="vertical">
                  {filtros.map((filtro) => renderFilter(filtro))}
                </Space>
              </Col>
            );
          })}
        </Row>
        <Row style={{ alignItems: 'flex-end', marginTop: 10, marginRight: 10 }}>
          <Button type="primary" htmlType="submit" style={{ backgroundColor: '#fa7923', border: 'none', marginLeft: 'auto', marginRight: 10 }}>
            Filtrar
          </Button>
          <Button
            style={{ color: '#fa7923', borderColor: '#fa7923' }}
            onClick={() => {
              busquedaForm.resetFields();
            }}>
            Limpiar
          </Button>
        </Row>
      </Form>
    );
  };

  const renderTable = () => {
    return (
      <Wrapper contentBody direction="row" horizontal="center">
        <Table
          rowKey={'id'}
          className={styles.table}
          size={'small'}
          scroll={{ y: '500px' }}
          fill
          columns={columns as ColumnsType<Mensaje> as any}
          dataSource={listaMensajes.info.mensajes?.value}
          loading={listaMensajes.info.mensajes?.loading}
          hideRowSelection
          extraColumns={{ showKeyColumn: true, showActionsColumn: false }}
          extraComponents={[
            {
              key: 'filters',
              node: renderFilters(),
              position: 'top',
              style: { width: '100%' },
            },
            /*          {
                key: 'refresh',
                node: <RefreshButton   />,
                position: 'top',
                style: { marginLeft: 'auto' },
              }, */
            {
              key: 'records-count-tag',
              node: 'records-count-tag',
              position: 'top',
              style: { marginLeft: 'auto', display: 'table' },
            },
          ]}
          sortable
          //pagination={{ pageSize: 20 }}
        />
      </Wrapper>
    );
  };

  //#endregion

  return (
    <Wrapper
      contentWrapper
      unselectable
      direction="column"
      vertical="top"
      horizontal="center"
      style={{ minWidth: getViewWidth(isContentLoading || hasContentError) }}>
      {isContentLoading ? <LoadingContent /> : hasContentError ? <ServiceError /> : renderTable()}
    </Wrapper>
  );
};
