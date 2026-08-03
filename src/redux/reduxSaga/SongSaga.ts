import { call, put, select, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import ToastAlert from '../../utils/helper/Toast';
import { ApiHeaders, ApiResponse } from '../types';
import {
  increasePlayCountFailure,
  increasePlayCountSuccess,
} from '../reducer/SongReducer';
import { postApi } from '../../utils/helper/ApiRequest';

const getItems = (state: any) => state.AuthReducer;

export function* increasePlayCountSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };

  try {
    const songId = action.payload?.id ?? action.payload ?? 1;
    const response: ApiResponse = yield call(
      postApi,
      `song/increase-play-count/${songId}`,
      action.payload?.body ?? {},
      header,
    );

    yield put(increasePlayCountSuccess(response?.data));
  } catch (error: any) {
    yield put(increasePlayCountFailure(error));
    ToastAlert(error?.response?.data?.message || 'Increase play count failed');
  }
}

export function* watchSongSaga(): Generator<any, void, any> {
  yield takeLatest('Song/increasePlayCountRequest', increasePlayCountSaga);
}
