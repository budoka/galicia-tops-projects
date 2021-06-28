import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosRequestConfig } from 'axios';
import { RequestConfig } from 'src/api/types';
import { Cliente, CuentaOpt } from 'src/features/shared/data/types';
import { addSolicitud } from '../transferencia/nueva-solicitud/logic';
import { NuevaSolicitudFormState } from '../transferencia/nueva-solicitud/data/types';
import { MensajeState, UIState } from './types';

const FEATURE_NAME = 'mensaje';

// Async actions
