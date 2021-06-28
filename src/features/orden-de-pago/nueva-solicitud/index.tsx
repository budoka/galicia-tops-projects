import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosRequestConfig } from 'axios';
import { RequestConfig } from 'src/api/types';
import { RootState } from 'src/app/store';
import { Cliente } from 'src/features/shared/data/types';
import { NuevaSolicitudState, NuevaTransferenciaFormRequest, SolicitudForm, UIState } from './types';

const FEATURE_NAME = 'nuevaSolicitud';
