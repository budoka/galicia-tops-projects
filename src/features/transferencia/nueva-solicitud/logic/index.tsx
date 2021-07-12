import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { apis } from 'src/api/setup/setup-apis';
import { HttpResponse } from 'src/api/types';
import { buildAxiosRequestConfig } from 'src/api/utils/api';
import { rejectRequest } from 'src/api/utils/axios';
import { createHttpAsyncThunk, RootState } from 'src/app/store';
import { Cliente, Cuenta, Moneda } from 'src/features/_shared/data/interfaces';
import { DetalleGastos, TipoCodigoBanco as TipoCodigoBancoType, TipoCuenta, TipoPersona } from 'src/features/_shared/data/types';
import { fetchCuentas, fetchDatosClientes } from 'src/features/_shared/logic';
import { AddSolicitudPayload } from '../data/dto';
import { FormNames } from '../data/forms';
import { Beneficiario, CuentaExterior, Gastos, Importe, NuevaSolicitudDataState, NuevaSolicitudState, StatusForms, TipoCodigoBanco } from '../data/interfaces';

const FEATURE_NAME = 'transferencia/nuevaSolicitud';

//#region Async Actions

export const addSolicitud = createHttpAsyncThunk<NuevaSolicitudDataState, void, { state: RootState; rejectValue: HttpResponse }>(
  FEATURE_NAME + '/addSolicitud',
  async (options, thunkApi) => {
    const { dispatch, getState } = thunkApi;
    const data = options?.body;

    if (!data) throw new Error('No se ha incluido datos para crear una nueva solicitud transferencia.');

    const requestData: AddSolicitudPayload = {
      datosOperacion: {
        fechaEntrada: data.form.datosOperacion?.fechaEntrada!,
        tipoDocumentoCliente: 'CUIT',
        documentoCliente: data.form.datosOperacion?.cliente?.documentos.find((d) => d.tipo === 'CUIT')?.numero!,
        monedaId: data.form.datosOperacion!.moneda.id!,
        beneficiario: {
          tipoDeDocumento: data.form.datosOperacion?.beneficiario.tipoDocumento,
          numeroDeDocumento: data.form.datosOperacion?.beneficiario.numeroDocumento,
          domicilio: data.form.datosOperacion?.beneficiario.domicilio!,
          codigoPostal: data.form.datosOperacion?.beneficiario.codigoPostal!,
          localidad: data.form.datosOperacion?.beneficiario.localidad!,
          fechaNacimiento: data.form.datosOperacion?.beneficiario.fechaNacimiento!,
          nif: data.form.datosOperacion?.beneficiario.nif!,
          tipoPersona: data.form.datosOperacion?.beneficiario.tipoPersona.id as TipoPersona,
          isoAlfanumericoPais: data.form.datosOperacion!.beneficiario.pais.id!,
          identificacionPersona:
            data.form.datosOperacion!.beneficiario.razonSocial ||
            `${data.form.datosOperacion!.beneficiario.apellido}, ${data.form.datosOperacion!.beneficiario.nombre}`,
          cuentaBancoDestino: {
            nombre: data.form.datosOperacion!.beneficiario.cuentaDestino?.nombreBanco!,
            localidad: data.form.datosOperacion!.beneficiario.cuentaDestino?.localidadBanco!,
            nroCuenta: data.form.datosOperacion!.beneficiario.cuentaDestino?.numero!,
            isoAlfanumericoPais: data.form.datosOperacion!.beneficiario.cuentaDestino?.pais.id!,
            codigoBanco: data.form.datosOperacion!.beneficiario.cuentaDestino?.codigoBanco,
            tipoCodigoDelBanco: (data.form.datosOperacion!.beneficiario.cuentaDestino?.tipoCodigoBanco as TipoCodigoBanco)?.id! as TipoCodigoBancoType,
            codigoDelBancoAdicional: data.form.datosOperacion!.beneficiario.cuentaDestino?.codigoBancoAdicional,
            tipoDeCodigoAdicional: data.form.datosOperacion!.beneficiario.cuentaDestino?.tipoCodigoBancoAdicional,
          },
          cuentaBancoIntermediario: !data.form.datosOperacion!.beneficiario.cuentaIntermediario
            ? undefined
            : {
                nombre: data.form.datosOperacion!.beneficiario.cuentaIntermediario?.nombreBanco!,
                localidad: data.form.datosOperacion!.beneficiario.cuentaIntermediario?.localidadBanco!,
                nroCuenta: data.form.datosOperacion!.beneficiario.cuentaIntermediario?.numero!,
                isoAlfanumericoPais: data.form.datosOperacion!.beneficiario.cuentaIntermediario?.pais.id!,
                codigoBanco: data.form.datosOperacion!.beneficiario.cuentaIntermediario?.codigoBanco,
                tipoCodigoDelBanco: (data.form.datosOperacion!.beneficiario.cuentaIntermediario?.tipoCodigoBanco as TipoCodigoBanco)
                  ?.id! as TipoCodigoBancoType,
                codigoDelBancoAdicional: data.form.datosOperacion!.beneficiario.cuentaIntermediario?.codigoBancoAdicional,
                tipoDeCodigoAdicional: data.form.datosOperacion!.beneficiario.cuentaIntermediario?.tipoCodigoBancoAdicional,
              },
        },
        cuentaDebito: {
          tipoDeCuenta: data.form.datosOperacion?.cuentaOrigen?.codigo as TipoCuenta,
          isoMonedaCuenta: data.form.datosOperacion?.cuentaOrigen?.monedaIso!,
          numeroDeCuenta: data.form.datosOperacion?.cuentaOrigen?.numero?.toString()!,
          sucursal: data.form.datosOperacion?.cuentaOrigen?.sucursalAdministradora.toString()!,
        },
        cuentaDebitoGastos: {
          tipoDeCuenta: data.form.datosOperacion?.cuentaComisiones?.codigo as TipoCuenta,
          isoMonedaCuenta: data.form.datosOperacion?.cuentaComisiones?.monedaIso!,
          numeroDeCuenta: data.form.datosOperacion?.cuentaComisiones?.numero?.toString()!,
          sucursal: data.form.datosOperacion?.cuentaOrigen?.sucursalAdministradora.toString()!,
        },
        gasto: {
          ...data.form.datosOperacion?.gastos,
          detalle: data.form.datosOperacion?.gastos.detalle.id as DetalleGastos,
        },

        // TODO: Cambiar importes: debe devolver id y codigo || codigo solo? si es id y codigo, fijarse como conseguir el id (porque es de Secopa)
        importes: data.form.datosOperacion?.importes.map((i) => ({ importe: i.importe, concepto: { id: '1', codigo: i.concepto.id } }))!,
        // importes: data.form.datosOperacion?.importes!,
      },
      normativas: {
        vinculadoConBeneficiario: data.form.normativas?.vinculadoConBeneficiario!,
      },
    };

    // Configuracion del servicio
    const api = apis['TRANSFERENCIA'];
    const resource = api.resources['AGREGAR_SOLICITUD'];
    const config = buildAxiosRequestConfig(api, resource, { ...options, body: requestData });

    // Llamado del servicio
    let response;

    try {
      response = await axios.request<void>(config);
    } catch (err) {
      return rejectRequest(err, thunkApi);
    }

    // Mapeo de la respuesta
    const responseData = response.data;

    return { status: response.status, data: responseData } as HttpResponse<void>;
  },
);

//#endregion

const initialState: NuevaSolicitudState = {
  info: {},
  data: {},
  ui: {
    form: {
      active: FormNames.DATOS_CLIENTE,
      status: { datosClientes: false, datosBeneficiario: false, cuentas: false, importes: false, varios: false },
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
    setDatosCuentas(
      state,
      action: PayloadAction<{ cuentaOrigen: Cuenta; cuentaComisiones: Cuenta; cuentaDestino: CuentaExterior; cuentaIntermediario?: CuentaExterior }>,
    ) {
      state.data.form = {
        ...state.data.form,
        datosOperacion: {
          ...state.data.form?.datosOperacion!,
          cuentaOrigen: action.payload.cuentaOrigen,
          cuentaComisiones: action.payload.cuentaComisiones,
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
    setDatosVarios(state, action: PayloadAction<{ fechaEntrda: string; gastos: Gastos }>) {
      state.data.form = {
        ...state.data.form,
        datosOperacion: {
          ...state.data.form?.datosOperacion!,
          fechaEntrada: action.payload.fechaEntrda,
          gastos: action.payload.gastos,
        },
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
    builder
      .addCase(addSolicitud.pending, (state) => {
        state.info.solicitudCreada = { value: false, loading: true };
      })
      .addCase(addSolicitud.fulfilled, (state) => {
        state.info.solicitudCreada = { value: true, loading: false };
      })
      .addCase(addSolicitud.rejected, (state, action) => {
        state.info.solicitudCreada = { value: false, loading: false, error: action.payload };
      });
  },
});

const {
  setDatosCliente,
  setDatosBeneficiario,
  setDatosVarios,
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
  setDatosVarios,
  setDatosCuentas,
  setDatosImportes,
  setActiveForm,
  setEstadoForm,
  setForm,
  resetCliente,
  cleanState,
};

export default slice.reducer;
