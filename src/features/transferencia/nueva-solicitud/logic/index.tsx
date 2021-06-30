import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { apis } from 'src/api/setup/setup-apis';
import { RequestConfig } from 'src/api/types';
import { buildAxiosRequestConfig } from 'src/api/utils/api';
import { RootState } from 'src/app/store';
import { Cliente, DetalleGasto, TipoCuenta, TipoPersona } from 'src/features/shared/data/types';
import { fetchConceptos, fetchCorresponsales, fetchCuentas, fetchDatosClientes, fetchMonedas, fetchPaises } from '../../shared/logic';
import { AddSolicitudDTO } from '../data/dto';
import {
  StatusForm,
  NuevaSolicitudDataState,
  NuevaSolicitudFormState,
  NuevaSolicitudState,
  Beneficiario,
  Gastos,
  Cuenta,
  Importe,
  Moneda,
} from '../data/types';
import { TransferenciaTabsNames } from '../data/types';

const FEATURE_NAME = 'nuevaSolicitud';

//#region Async actions

export const addSolicitud = createAsyncThunk<void, RequestConfig<NuevaSolicitudDataState>, { state: RootState }>(
  FEATURE_NAME + '/addSolicitud',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;
    const data = options?.data;

    if (!data) throw new Error('No se ha incluido datos para crear una nueva solicitud transferencia.');

    console.log(data);

    const requestData: AddSolicitudDTO = {
      datosOperacion: {
        ...data.form.datosOperacion!,
        cuitCliente: data.form.datosOperacion?.cliente?.documentos.find((d) => d.tipo === 'CUIT')?.numero!,
        monedaId: data.form.datosOperacion!.moneda.id!,
        beneficiario: {
          ...data.form.datosOperacion!.beneficiario!,
          tipoPersona: data.form.datosOperacion?.beneficiario.tipoPersona.id as TipoPersona,
          paisId: data.form.datosOperacion!.beneficiario.pais.id!,
          razonSocial:
            data.form.datosOperacion!.beneficiario.razonSocial ??
            `${data.form.datosOperacion!.beneficiario.apellido}, ${data.form.datosOperacion!.beneficiario.nombre}`,
          banco: {
            ...data.form.datosOperacion!.beneficiario.banco!,
            nroCuenta: data.form.datosOperacion!.beneficiario.banco.cuenta!,
            paisId: data.form.datosOperacion!.beneficiario.banco.pais.id!,
          },
        },
        bancoIntermediario: {
          ...data.form.datosOperacion!.bancoIntermediario!,
          nroCuenta: data.form.datosOperacion!.bancoIntermediario.cuenta!,
          paisId: data.form.datosOperacion!.bancoIntermediario.pais.id!,
        },
        cuentaDebito: {
          tipoCuenta: data.form.datosOperacion?.cuentaDebito?.codigo as TipoCuenta,
          monedaId: data.form.datosOperacion?.cuentaDebito?.monedaIso!,
          numero: data.form.datosOperacion?.cuentaDebito?.numero?.toString()!,
        },
        cuentaDebitoGastos: {
          tipoCuenta: data.form.datosOperacion?.cuentaDebitoGastos?.codigo as TipoCuenta,
          monedaId: data.form.datosOperacion?.cuentaDebitoGastos?.monedaIso!,
          numero: data.form.datosOperacion?.cuentaDebitoGastos?.numero?.toString()!,
        },
        gasto: {
          ...data.form.datosOperacion?.gastos,
          detalle: data.form.datosOperacion?.gastos.detalle.id as DetalleGasto,
        },
        vinculadoConBeneficiario: data.form.datosOperacion?.vinculadoConBeneficiario!,
      },
    };

    // Configuracion del servicio
    const api = apis['TRANSFERENCIA'];
    const resource = api.resources['AGREGAR_SOLICITUD'];
    const config = buildAxiosRequestConfig(api, resource, { ...options /*  data: requestData  */ });

    console.log(config);

    // Respuesta del servicio
    const response = await axios.request<void>(config);
    const responseData = response.data;

    console.log(responseData);
  },
);

//#endregion

const initialState: NuevaSolicitudState = {
  info: {},
  data: {},
  ui: {
    form: {
      active: TransferenciaTabsNames.DATOS_CLIENTE,
      status: { datosClientes: false, datosBeneficiario: false, cuentas: false, gastos: false, importes: false },
    },
  },
  error: null,
};

const slice = createSlice({
  name: FEATURE_NAME,
  initialState,
  reducers: {
    /*    setForm(state, action: PayloadAction<NuevaSolicitudFormState>) {
      state.data.form = action.payload;
    }, */
    setDatosCliente(state, action: PayloadAction<{ cliente: Cliente; vinculadoConBeneficiario: boolean }>) {
      state.data.form = {
        ...state.data.form,
        datosOperacion: {
          ...state.data.form?.datosOperacion!,
          cliente: action.payload.cliente,
          vinculadoConBeneficiario: action.payload.vinculadoConBeneficiario,
        },
      };
    },
    setDatosBeneficiario(state, action: PayloadAction<Beneficiario>) {
      state.data.form = { ...state.data.form, datosOperacion: { ...state.data.form?.datosOperacion!, beneficiario: action.payload } };
    },
    setDatosGastos(state, action: PayloadAction<{ gastos: Gastos; cuentaDebitoGastos: Cuenta }>) {
      state.data.form = {
        ...state.data.form,
        datosOperacion: {
          ...state.data.form?.datosOperacion!,
          gastos: action.payload.gastos,
          cuentaDebitoGastos: action.payload.cuentaDebitoGastos,
        },
      };
    },
    setDatosCuentas(state, action: PayloadAction<Cuenta>) {
      state.data.form = { ...state.data.form, datosOperacion: { ...state.data.form?.datosOperacion!, cuentaDebito: action.payload } };
    },
    setDatosImportes(state, action: PayloadAction<{ importes: Importe[]; moneda: Moneda }>) {
      state.data.form = {
        ...state.data.form,
        datosOperacion: { ...state.data.form?.datosOperacion!, importes: action.payload.importes, moneda: action.payload.moneda },
      };
    },
    setActiveForm(state, action: PayloadAction<string>) {
      state.ui.form.active = action.payload;
    },
    setEstadoForm(state, action: PayloadAction<StatusForm>) {
      state.ui.form.status = { ...state.ui.form.status, ...action.payload };
    },
    resetCliente(state) {
      state.info.clientes = { value: [], loading: false };
      // state.info.clientes = undefined;
      state.data.form = {
        ...state.data.form,
        datosOperacion: {
          ...state.data.form?.datosOperacion!,
          cliente: undefined,
          vinculadoConBeneficiario: undefined,
        },
      };
    },
    cleanState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonedas.pending, (state) => {
        state.info.monedas = { value: [], loading: true };
        state.error = null;
      })
      .addCase(fetchMonedas.fulfilled, (state, action) => {
        state.info.monedas = { value: action.payload, loading: false };
      })
      .addCase(fetchMonedas.rejected, (state, action) => {
        state.info.monedas = { value: [], loading: false };
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(fetchPaises.pending, (state) => {
        state.info.paises = { value: [], loading: true };
        state.error = null;
      })
      .addCase(fetchPaises.fulfilled, (state, action) => {
        state.info.paises = { value: action.payload, loading: false };
      })
      .addCase(fetchPaises.rejected, (state, action) => {
        state.info.paises = { value: [], loading: false };
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(fetchCorresponsales.pending, (state) => {
        state.info.corresponsales = { value: [], loading: true };
        state.error = null;
      })
      .addCase(fetchCorresponsales.fulfilled, (state, action) => {
        state.info.corresponsales = { value: action.payload, loading: false };
      })
      .addCase(fetchCorresponsales.rejected, (state, action) => {
        state.info.corresponsales = { value: [], loading: false };
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(fetchConceptos.pending, (state) => {
        state.info.conceptos = { value: [], loading: true };
        state.error = null;
      })
      .addCase(fetchConceptos.fulfilled, (state, action) => {
        state.info.conceptos = { value: action.payload, loading: false };
      })
      .addCase(fetchConceptos.rejected, (state, action) => {
        state.info.conceptos = { value: [], loading: false };
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(fetchDatosClientes.pending, (state) => {
        state.info.clientes = { value: [], loading: true };
        state.error = null;
      })
      .addCase(fetchDatosClientes.fulfilled, (state, action) => {
        state.info.clientes = { value: action.payload, loading: false };
      })
      .addCase(fetchDatosClientes.rejected, (state, action) => {
        state.info.clientes = { value: [], loading: false };
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(fetchCuentas.pending, (state) => {
        state.info.cuentas = { value: [], loading: true };
        state.error = null;
      })
      .addCase(fetchCuentas.fulfilled, (state, action) => {
        state.info.cuentas = { value: action.payload, loading: false };
      })
      .addCase(fetchCuentas.rejected, (state, action) => {
        state.info.cuentas = { value: [], loading: false };
        state.error = action.error.message ?? null;
      });
    /*  builder
      .addCase(addSolicitud.pending, (state) => {
        state.form = { ...state.form, loading: true };
        state.error = null;
      })
      .addCase(addSolicitud.fulfilled, (state) => {
        state.form = { ...state.form, loading: false };
      })
      .addCase(addSolicitud.rejected, (state, action) => {
        state.form = { ...state.form, loading: false };
        state.error = action.error.message ?? null;
      }); */
  },
});

const {
  setDatosCliente,
  setDatosBeneficiario,
  setDatosGastos,
  setDatosCuentas,
  setDatosImportes,
  setActiveForm,
  setEstadoForm,
  resetCliente,
  cleanState,
} = slice.actions;

export {
  setDatosCliente,
  setDatosBeneficiario,
  setDatosGastos,
  setDatosCuentas,
  setDatosImportes,
  setActiveForm,
  setEstadoForm,
  resetCliente,
  cleanState,
};

export default slice.reducer;
