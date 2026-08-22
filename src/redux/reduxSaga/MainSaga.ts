import AsyncStorage from '@react-native-async-storage/async-storage';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import ToastAlert from '../../utils/helper/Toast';
import {
  peopleListFailure,
  peopleListSuccess,
  myProfileRequest,
  myProfileSuccess,
  myProfileFailure,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
  getDashboardSuccess,
  getDashboardFailure,
  getArtistDetailsRequest,
  getArtistDetailsSuccess,
  getArtistDetailsFailure,
} from '../reducer/MainReducer';
// import { getApi, postApi } from '../../utils/helper/ApiRequest';
import { ApiHeaders, ApiResponse } from '../types';
import { constants } from '../../utils/constants';
import {
  getApi,
  postApi,
  deleteApi,
  getApiWithParam,
} from '../../utils/helper/ApiRequest';
import { goBack, navigate } from '../../utils/helper/RootNavigation';
import { cacheSignal } from 'react';
import { getTokenSuccess } from '../reducer/AuthReducer';

const getItems = (state: any) => state.AuthReducer;

//people list saga
export function* peopleListSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  console.log('item', item.getTokenResponse);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const page = action.payload?.page || 1;
    const limit = action.payload?.limit || 10;
    const response: ApiResponse = yield call(
      getApi,
      `users?page=${page}&limit=${limit}`,
      header,
    );

    console.log('118', response);
    yield put(
      peopleListSuccess({
        data: response?.data?.data?.data || [],
        page: page,
      }),
    );
  } catch (error: any) {
    console.log(error);
    yield put(peopleListFailure(error));
    ToastAlert(error?.response?.data?.message || 'Social Main Failed');
  }
}

export function* getDashboardSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const response: ApiResponse = yield call(getApi, 'dashboard', header);
    yield put(getDashboardSuccess(response?.data));
  } catch (error: any) {
    yield put(getDashboardFailure(error));
    ToastAlert(error?.response?.data?.message || 'getDashboard Failed');
  }
}

export function* myProfileSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const response: ApiResponse = yield call(getApi, 'my-profile', header);
    console.log('my-profile response:', response);
    yield put(myProfileSuccess(response?.data));
  } catch (error: any) {
    yield put(myProfileFailure(error));
    ToastAlert(error?.response?.data?.message || 'myProfile Failed');
  }
}

export function* updateProfileSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const isFormData = action.payload instanceof FormData;
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: isFormData ? 'multipart/form-data' : 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const response: ApiResponse = yield call(
      postApi,
      'update-profile',
      action.payload,
      header,
    );
    yield put(updateProfileSuccess(response?.data));
    ToastAlert(response?.data?.message || 'Profile updated successfully');
    yield put(myProfileRequest({}));
    goBack();
  } catch (error: any) {
    yield put(updateProfileFailure(error));
    ToastAlert(error?.response?.data?.message || 'updateProfile Failed');
  }
}

export function* getArtistDetailsSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };
  try {
    const artistId = action.payload?.id ?? action.payload ?? 1;
    const response: ApiResponse = yield call(getApi, `artist/details/${artistId}`, header);
    yield put(getArtistDetailsSuccess(response?.data));
  } catch (error: any) {
    yield put(getArtistDetailsFailure(error));
    ToastAlert(error?.response?.data?.message || 'getArtistDetails Failed');
  }
}

// Watcher Saga
export function* watchMainSaga(): Generator<any, void, any> {
  yield takeLatest('Main/myProfileRequest', myProfileSaga);
  yield takeLatest('Main/peopleListRequest', peopleListSaga);
  yield takeLatest('Main/updateProfileRequest', updateProfileSaga);
  yield takeLatest('Main/getDashboardRequest', getDashboardSaga);
  yield takeLatest('Main/getArtistDetailsRequest', getArtistDetailsSaga);
}
