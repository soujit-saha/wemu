import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SongState {
  status: string;
  isLoading: boolean;
  error?: string;
  increasePlayCountRes?: any;
}

const initialState: SongState = {
  status: '',
  isLoading: false,
  increasePlayCountRes: {},
};

const SongSlice = createSlice({
  name: 'Song',
  initialState,
  reducers: {
    increasePlayCountRequest(state, action: PayloadAction<any>) {
      state.isLoading = true;
      state.status = action.type;
    },
    increasePlayCountSuccess(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.increasePlayCountRes = action.payload;
      state.status = action.type;
    },
    increasePlayCountFailure(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.error = action.payload?.error || 'increase play count failed';
      state.status = action.type;
    },
  },
});

export const {
  increasePlayCountRequest,
  increasePlayCountSuccess,
  increasePlayCountFailure,
} = SongSlice.actions;

export default SongSlice.reducer;
