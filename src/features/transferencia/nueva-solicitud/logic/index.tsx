import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { apis } from 'src/api/setup/setup-apis';
import { HttpResponse } from 'src/api/types';
import { buildAxiosRequestConfig } from 'src/api/utils/api';
import { rejectRequest } from 'src/api/utils/axios';
import { createHttpAsyncThunk, RootState } from 'src/app/store';
import { Cliente, Moneda } from 'src/features/_shared/data/interfaces';
import { DetalleGasto, TipoCuenta, TipoPersona } from 'src/features/_shared/data/types';
import { fetchCuentas, fetchDatosClientes } from 'src/features/_shared/logic';
import { AddSolicitudDTO } from '../data/dto';
import { FormNames } from '../data/forms';
import { Beneficiario, Cuenta, CuentaExterior, Gastos, Importe, NuevaSolicitudDataState, NuevaSolicitudState, StatusForms } from '../data/interfaces';

const FEATURE_NAME = 'nuevaSolicitud';

//#region Async actions

export const addSolicitud = createHttpAsyncThunk<NuevaSolicitudDataState, void, { state: RootState; rejectValue: HttpResponse }>(
  FEATURE_NAME + '/addSolicitud',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;
    const data = options?.body;

    if (!data) throw new Error('No se ha incluido datos para crear una nueva solicitud transferencia.');

    // Configuracion del servicio
    const api = apis['TRANSFERENCIA'];
    const resource = api.resources['AGREGAR_SOLICITUD'];
    const config = buildAxiosRequestConfig(api, resource, { ...options /*  data: requestData  */ });

    // const requestData: AddSolicitudDTO = {
    const requestData: any = {
      datosOperacion: {
        ...data.form.datosOperacion!,
        tipoDocumentoCliente: 'CUIT',
        documentoCliente: data.form.datosOperacion?.cliente?.documentos.find((d) => d.tipo === 'CUIT')?.numero!,
        monedaId: data.form.datosOperacion!.moneda.id!,
        beneficiario: {
          ...data.form.datosOperacion!.beneficiario!,
          tipoPersona: data.form.datosOperacion?.beneficiario.tipoPersona.id as TipoPersona,
          isoAlfanumericoPais: data.form.datosOperacion!.beneficiario.pais.id!,
          razonSocial:
            data.form.datosOperacion!.beneficiario.razonSocial ??
            `${data.form.datosOperacion!.beneficiario.apellido}, ${data.form.datosOperacion!.beneficiario.nombre}`,
          cuentaBancoDestino: {
            ...data.form.datosOperacion!.beneficiario.cuentaDestino!,
            nroCuenta: data.form.datosOperacion!.beneficiario.cuentaDestino?.cuenta!,
            paisId: data.form.datosOperacion!.beneficiario.cuentaDestino?.pais.id!,
          },
          cuentaBancoIntermediario: {
            ...data.form.datosOperacion!.beneficiario.cuentaIntermediario!,
            nroCuenta: data.form.datosOperacion!.beneficiario.cuentaIntermediario?.cuenta!,
            paisId: data.form.datosOperacion!.beneficiario.cuentaIntermediario?.pais.id!,
          },
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
      },
      normativas: {
        vinculadoConBeneficiario: data.form.normativas?.vinculadoConBeneficiario!,
      },
    };

    console.log(config);

    // Llamado del servicio
    let response;

    try {
      response = await axios.request<void>(config);
    } catch (err) {
      return rejectRequest(err, thunkApi);
    }

    // Mapeo de la respuesta
    const responseData = response.data;

    console.log(responseData);

    return { status: response.status, data: responseData } as HttpResponse<void>;
  },
);

//#endregion

const initialState: NuevaSolicitudState = {
  info: {},
  data: {},
  ui: {
    form: {
      active: FormNames.CUENTAS,
      status: { datosClientes: false, datosBeneficiario: false, cuentas: false, gastos: false, importes: false },
    },
  },
};

const slice = createSlice({
  name: FEATURE_NAME,
  initialState,
  reducers: {
    setDatosCliente(state, action: PayloadAction<{ cliente: Cliente; vinculadoConBeneficiario: boolean }>) {
      state.data.form = {
        ...state.data.form,
        datosOperacion: {
          ...state.data.form?.datosOperacion!,
          cliente: action.payload.cliente,
        },
        normativas: {
          vinculadoConBeneficiario: action.payload.vinculadoConBeneficiario,
        },
      };
    },
    setDatosBeneficiario(state, action: PayloadAction<Beneficiario>) {
      state.data.form = { ...state.data.form, datosOperacion: { ...state.data.form?.datosOperacion!, beneficiario: action.payload } };
    },
    setDatosGastos(state, action: PayloadAction<Gastos>) {
      state.data.form = {
        ...state.data.form,
        datosOperacion: {
          ...state.data.form?.datosOperacion!,
          gastos: action.payload,
        },
      };
    },
    setDatosCuentas(
      state,
      action: PayloadAction<{ cuentaDebito: Cuenta; cuentaDebitoGastos: Cuenta; cuentaDestino: CuentaExterior; cuentaIntermediario: CuentaExterior }>,
    ) {
      state.data.form = {
        ...state.data.form,
        datosOperacion: {
          ...state.data.form?.datosOperacion!,
          cuentaDebito: action.payload.cuentaDebito,
          cuentaDebitoGastos: action.payload.cuentaDebitoGastos,
          beneficiario: {
            ...state.data.form?.datosOperacion?.beneficiario!,
            cuentaDestino: action.payload.cuentaDestino,
            cuentaIntermediario: action.payload.cuentaIntermediario,
          },
        },
      };
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
    setEstadoForm(state, action: PayloadAction<StatusForms>) {
      state.ui.form.status = { ...state.ui.form.status, ...action.payload };
    },
    setForm(state, action: PayloadAction<{ active?: string; status?: StatusForms }>) {
      state.ui.form = { ...state.ui.form, ...action.payload };
    },
    resetCliente(state) {
      state.info.clientes = { value: [], loading: false };
      state.data.form = {
        ...state.data.form,
        datosOperacion: {
          ...state.data.form?.datosOperacion!,
          cliente: undefined,
        },
        normativas: {
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
      .addCase(fetchDatosClientes.pending, (state) => {
        state.info.clientes = { value: [], loading: true };
      })
      .addCase(fetchDatosClientes.fulfilled, (state, action) => {
        state.info.clientes = { value: action.payload?.data, loading: false };
      })
      .addCase(fetchDatosClientes.rejected, (state, action) => {
        state.info.clientes = { value: [], loading: false, error: action.payload };
      });
    builder
      .addCase(fetchCuentas.pending, (state) => {
        state.info.cuentas = { value: [], loading: true };
      })
      .addCase(fetchCuentas.fulfilled, (state, action) => {
        state.info.cuentas = { value: action.payload?.data, loading: false };
      })
      .addCase(fetchCuentas.rejected, (state, action) => {
        state.info.cuentas = { value: [], loading: false, error: action.payload };
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
  setForm,
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
  setForm,
  resetCliente,
  cleanState,
};

export default slice.reducer;
