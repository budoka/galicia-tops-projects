import { EyeOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Modal, Row, Select, Space } from 'antd';
import locale from 'antd/lib/date-picker/locale/es_ES';
import { useForm } from 'antd/lib/form/Form';
import { LabeledValue } from 'antd/lib/select';
import _ from 'lodash';
import moment from 'moment';
import React, { CSSProperties, useContext, useEffect } from 'react';
import { RootState } from 'src/app/store';
import { useAppDispatch, useAppSelector } from 'src/app/store/store.hooks';
import { LoadingContent } from 'src/components/loading';
import { ServiceError } from 'src/components/service-error';
import { ColumnTypeEx, Table } from 'src/components/table';
import { Wrapper } from 'src/components/wrapper';
import { Texts } from 'src/constants/texts';
import { Paginator } from 'src/features/_shared/data/interfaces';
import { getRule } from 'src/features/_shared/ui/utils';
import { hasError, isFetchingData } from 'src/helpers/validation.helper';
import { Rules } from 'src/types';
import { formatCurrencyAmount, formatDate } from 'src/utils/formatter.utils';
import { getViewWidth } from 'src/utils/screen.utils';
import { compare } from 'src/utils/string.utils';
import { InfoMensaje } from '../../info-mensaje/ui';
import { GetMensajesPayload } from '../data/dto';
import { FiltrosForm } from '../data/forms';
import { Mensaje } from '../data/interfaces';
import { setMensaje, setModalVisible, setPaginator } from '../logic';
import styles from './style.module.less';

interface TableFilter {
  key: string;
  title: React.ReactNode;
  type: FilterType;
  items?: LabeledValue[];
  value?: string | number;
}

type FilterType = 'text' | 'date' | 'date-range' | 'list';

const filters: TableFilter[] = [
  {
    key: 'rangoFecha',
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

const rules: Rules = {
  rangoFecha: [
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
    render: (value, record, index) => formatDate(record.fecha, 'DD/MM/YYYY HH:mm'),
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
  {
    key: 'ver',
    dataIndex: 'ver',
    title: Texts.WATCH,
    width: 100,
    inputType: 'button',
  },
] as ColumnTypeEx<Mensaje>[];

export const ListaMensajes: React.FC = (props) => {
  const dispatch = useAppDispatch();
  const listaMensajes = useAppSelector((state: RootState) => state.mensaje.listaMensajes);
  const shared = useAppSelector((state: RootState) => state.shared);
  const router = useAppSelector((state: RootState) => state.router);

  const [busquedaForm] = useForm<FiltrosForm>();

  const mergedFilters = filters.map((f) =>
    f.key === 'moneda' ? ({ ...f, items: shared.monedas?.value?.map((m) => ({ value: m.id, label: m.descripcion } as LabeledValue)) } as TableFilter) : f,
  );

  const mergedColumns = columns.map((column) => {
    if (column.key === 'ver') {
      return {
        ...column,
        render: (value: any, record: Mensaje) => (
          <Button
            type="primary"
            shape="circle"
            style={{ color: '#fa7923', backgroundColor: 'transparent', border: 'none' }}
            onClick={() => handleOnShowMensaje(record.id)}
            icon={<EyeOutlined />}></Button>
        ),
      };
    } else {
      return column;
    }
  });

  //#region UseEffects

  useEffect(() => {
    fetchData();
  }, []);

  //#endregion

  //#region Handlers

  const handleOnFinish = () => {
    const { moneda, rangoFecha, ...rest } = busquedaForm.getFieldsValue();

    const filtros = { ...rest, moneda: moneda?.value?.toString(), rangoFecha: rangoFecha?.map((f: any) => formatDate(f, 'DD/MM/YYYY')) };

    const payload: GetMensajesPayload = {
      beneficiario: filtros.beneficiario,
      ordenante: filtros.ordenante,
      fechaInicial: filtros.rangoFecha?.length >= 1 ? filtros.rangoFecha[0] : undefined,
      fechaFinal: filtros.rangoFecha?.length >= 2 ? filtros.rangoFecha[1] : undefined,
      importeDesde: filtros.importeMinimo,
      importeHasta: filtros.importeMaximo,
      tipoMT: filtros.tipo,
      uetr: filtros.uetr,
      divisa: filtros.moneda,
      referencia: filtros.referencia,
      pageSize: listaMensajes.data.paginator?.pageSize!,
    };

    fetchData(payload);
  };

  const handleOnReset = () => {
    resetFilters();
  };

  const handleOnPaginationChange = (current?: number, pageSize?: number) => {
    const paginator: Paginator = { current, pageSize };
    dispatch(setPaginator(paginator));
  };

  const handleOnShowMensaje = (id: number) => {
    showMensaje(id);
  };

  const handleOnModalVisible = (visible: boolean) => {
    setModal(visible);
  };

  //#endregion

  //#region Other functions

  const fetchData = async (payload?: GetMensajesPayload) => {
    /*  return () => {
      dispatch(cleanState());
    }; */
  };

  const resetFilters = () => {
    busquedaForm.resetFields();
  };

  const showMensaje = (id: number) => {
    dispatch(setMensaje(id));
    setModal(true);
  };

  const setModal = (visible: boolean) => {
    dispatch(setModalVisible(visible));
  };

  //#endregion

  const isContentLoading = isFetchingData(shared);

  const hasContentError = hasError(shared);

  //#region Renders

  const renderListFilter = (filter: TableFilter, style?: CSSProperties, mode?: 'multiple' | 'tags') => {
    const { key, title, items } = filter;

    return (
      <Form.Item key={key} name={key} label={title} style={style} rules={getRule(rules, key)}>
        <Select labelInValue mode={mode} allowClear>
          {items?.map((item) => (
            <Option key={item.value} value={item.value}>
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
        return renderListFilter(filter, { ...style });
      default:
        break;
    }
  };

  const renderFilters = (filters: TableFilter[]) => {
    const chunks = _.chunk(filters, 3);
    return (
      <Form form={busquedaForm} className={styles.filterForm} onFinish={handleOnFinish}>
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
          <Button type="primary" htmlType="submit" style={{ marginLeft: 'auto', marginRight: 10 }}>
            Buscar
          </Button>
          <Button onClick={handleOnReset}>Limpiar</Button>
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
          columns={mergedColumns as any}
          dataSource={listaMensajes.info.mensajes?.value}
          loading={listaMensajes.info.mensajes?.loading}
          hideRowSelection
          extraColumns={{ showKeyColumn: true, showActionsColumn: false }}
          extraComponents={[
            {
              key: 'records-count-tag',
              node: 'records-count-tag',
              position: 'top',
              style: { marginLeft: 'auto', display: 'table' },
            },
          ]}
          sortable
          pagination={{
            current: listaMensajes.data.paginator?.current,
            pageSize: listaMensajes.data.paginator?.pageSize,
            total: listaMensajes.data.paginator?.total,
            onChange: handleOnPaginationChange,
          }}
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
      {/*   {isContentLoading ? <LoadingContent /> : renderTable()} */}
      {isContentLoading ? <LoadingContent /> : hasContentError ? <ServiceError /> : renderTable()}
      <Modal
        title={`Mensaje ${listaMensajes.data.idMensaje}`}
        centered
        visible={listaMensajes.ui.modal}
        footer={null}
        width="60%"
        onCancel={() => handleOnModalVisible(false)}
        /*afterClose={clearDetailModal}*/
      >
        {listaMensajes.data.idMensaje ? <InfoMensaje id={listaMensajes.data.idMensaje} /> : <LoadingContent />}
      </Modal>
    </Wrapper>
  );
};
