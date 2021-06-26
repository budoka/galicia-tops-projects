import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosRequestConfig } from 'axios';
import { RequestConfig } from 'src/api/types';
import { fetchConceptos, fetchCorresponsales, fetchDatosClientes, fetchMonedas } from 'src/features/shared';
import { Cliente } from 'src/features/shared/types';
import { RootState } from 'src/reducers';
import { NuevaSolicitudState, NuevaTransferenciaFormRequest, SolicitudForm, UIState } from './types';

const FEATURE_NAME = 'nuevaSolicitud';

// Async actions

export const addSolicitud = createAsyncThunk<void, RequestConfig<SolicitudForm>, { state: RootState }>(
  FEATURE_NAME + '/addSolicitud',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;
    const data = options?.data;

    if (!data) throw new Error('AddSolicitud - no incluye datos');

    const importeComision = 100;

    console.log(data);

    const requestData: NuevaTransferenciaFormRequest = {
      fechaAlta: data.fecha.toISOString(true),
      codigoConcepto: data.concepto.value,
      importe: data.importe,
      monedaId: data.moneda.value,
      gasto: {
        importe: importeComision,
        moneda: data.moneda.value,
      },
      comision: {
        monedaComision: data.moneda.value,
        monedaCuenta: data.moneda.value,
        importeComision: importeComision,
        importeCuenta: 0,
        cotizacionComision: 0,
        esBonificada: false,
        estado: 'sin definir',
        tipoComision: data.tipoComision.value,
      },
    };

    // Configuracion del servicio
    /*  const api = apis['COMMON'];
    const resource = api.resources['MONEDA'];
    const config = buildAxiosRequestConfig(api, resource, options);  */

    const endpoint = 'http://localhost:8000/api/Solicitud';
    const verb = 'POST';
    const headers = {
      ...options?.headers,
    };
    const config: AxiosRequestConfig = { method: verb, url: endpoint, headers, data: requestData };

    console.log(config);

    // Respuesta del servicio
    const response = await axios.request<void>(config);
    const responseData = response.data;

    /*   // Mapeo de la respuesta
    const conceptos = responseData.map((concepto) => {
      return {
        id: concepto.codigo,
        valor: concepto.codigo,
        descripcion: `${concepto.codigo} (${concepto.descripcion})`,
      };
    }) as Concepto[];
 */
  },
);

// Slice

const initialState: NuevaSolicitudState = {
  requiredData: {},
  form: {},
  ui: {},
  error: null,
};

const slice = createSlice({
  name: FEATURE_NAME,
  initialState,
  reducers: {
    setPersona(state, action: PayloadAction<Cliente>) {
      state.requiredData.persona!.value! = action.payload;
    },
    setForm(state, action: PayloadAction<SolicitudForm>) {
      state.form.data = action.payload;
    },
    clearForm(state) {
      state.form = {};
    },
    setUI(state, action: PayloadAction<UIState>) {
      state.ui = action.payload;
    },
    clearUI(state) {
      state.ui = {};
    },
    clearState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonedas.pending, (state) => {
        state.requiredData.monedas = { values: [], loading: true };
        state.error = null;
      })
      .addCase(fetchMonedas.fulfilled, (state, action) => {
        state.requiredData.monedas = { values: action.payload, loading: false };
      })
      .addCase(fetchMonedas.rejected, (state, action) => {
        state.requiredData.monedas = { values: [], loading: false };
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(fetchCorresponsales.pending, (state) => {
        state.requiredData.corresponsales = { values: [], loading: true };
        state.error = null;
      })
      .addCase(fetchCorresponsales.fulfilled, (state, action) => {
        state.requiredData.corresponsales = { values: action.payload, loading: false };
      })
      .addCase(fetchCorresponsales.rejected, (state, action) => {
        state.requiredData.corresponsales = { values: [], loading: false };
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(fetchConceptos.pending, (state) => {
        state.requiredData.conceptos = { values: [], loading: true };
        state.error = null;
      })
      .addCase(fetchConceptos.fulfilled, (state, action) => {
        state.requiredData.conceptos = { values: action.payload, loading: false };
      })
      .addCase(fetchConceptos.rejected, (state, action) => {
        state.requiredData.conceptos = { values: [], loading: false };
        state.error = action.error.message ?? null;
      });
    builder
      .addCase(fetchDatosClientes.pending, (state) => {
        state.requiredData.personas = { value: [], loading: true };
        state.error = null;
      })
      .addCase(fetchDatosClientes.fulfilled, (state, action) => {
        state.requiredData.personas = { value: action.payload, loading: false };
      })
      .addCase(fetchDatosClientes.rejected, (state, action) => {
        state.requiredData.personas = { value: [], loading: false };
        state.error = action.error.message ?? null;
      });
    builder
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
      });
  },
});

const { setForm, clearForm, setUI, clearUI, clearState } = slice.actions;

export { setForm, clearForm, setUI, clearUI, clearState };

export default slice.reducer;
