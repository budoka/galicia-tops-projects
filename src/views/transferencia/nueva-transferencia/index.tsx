import { unwrapResult } from '@reduxjs/toolkit';
import { DatePicker, message, Select, Tabs, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { ArgsProps } from 'antd/lib/message';
import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StateContext } from 'src/app';
import { LoadingContent } from 'src/components/loading';
import { Wrapper } from 'src/components/wrapper';
import { Texts } from 'src/constants/texts';
import { fetchConceptos, fetchCorresponsales, fetchMonedas, fetchProductos } from 'src/features/shared';
import { addSolicitud, clearForm, clearState, clearUI } from 'src/features/transferencia/nueva-solicitud';
import { ClienteForm, NuevaTransferenciaForm } from 'src/features/transferencia/nueva-solicitud/types';
import { RootState } from 'src/reducers';
import { useAppDispatch } from 'src/app/store/hooks';
import { Rules } from 'src/types';
import { getFreshToken } from 'src/utils/auth';
import { getViewWidth } from 'src/utils/screen';
import { BeneficiarioFormPanel } from './datos-beneficiario';
import { ClienteFormPanel } from './datos-cliente';
import { IntermediariosFormPanel } from './datos-intermediario';

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

export const NuevaTransferencia: React.FC = (props) => {
  const [transferenciaForm] = useForm<NuevaTransferenciaForm>();
  const [personaForm] = useForm<ClienteForm>();
  const state = useContext(StateContext);
  const dispatch = useAppDispatch();

  const nuevaTransferencia = useSelector((state: RootState) => state.transferencias.nuevaSolicitud);

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
      const { hostId } = persona;
      dispatch(fetchProductos({ query: { hostId, productos: 'CA,CC' } }))
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

  const handleNuevaTransferenciaForm = (values: NuevaTransferenciaForm) => {
    dispatch(addSolicitud({ data: values }))
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

  interface TransferenciaTabs {
    [tab: string]: JSX.Element;
  }

  const transferenciaTabs: TransferenciaTabs = {
    cliente: (
      <TabPane tab={`Datos del Cliente`} key={1}>
        <ClienteFormPanel />
      </TabPane>
    ),
    beneficiario: (
      <TabPane tab={`Datos del Beneficiario`} key={2}>
        <BeneficiarioFormPanel />
      </TabPane>
    ),
    intermediarios: (
      <TabPane tab={`Datos de Intermediarios`} key={3}>
        <IntermediariosFormPanel />
      </TabPane>
    ),
  };

  const loadingContent = false;

  return (
    <Wrapper
      contentWrapper
      unselectable
      direction="column"
      vertical="top"
      horizontal="left"
      style={{ width: getViewWidth(loadingContent) }}>
      {loadingContent ? (
        <LoadingContent />
      ) : (
        <>
          <Tabs defaultActiveKey="1" tabPosition={'left'}>
            {Object.values(transferenciaTabs).map((tab) => tab)}
          </Tabs>
        </>
      )}
    </Wrapper>
  );
};
