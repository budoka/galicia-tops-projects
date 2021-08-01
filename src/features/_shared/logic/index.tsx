import { createSlice } from '@reduxjs/toolkit';
import { SharedState } from '../data/interfaces';

const FEATURE_NAME = 'shared';

const initialState: SharedState = {};

const slice = createSlice({
  name: FEATURE_NAME,
  initialState,
  reducers: {
    cleanState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {},
});

const { cleanState } = slice.actions;

export { cleanState };

export default slice.reducer;
