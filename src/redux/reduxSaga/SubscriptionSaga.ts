import { call, put, select, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import ToastAlert from '../../utils/helper/Toast';
import { ApiHeaders, ApiResponse } from '../types';
import {
  myCurrentSubscriptionFailure,
  myCurrentSubscriptionSuccess,
  purchaseSubscriptionFailure,
  purchaseSubscriptionSuccess,
  subscriptionsFailure,
  subscriptionsSuccess,
  getSectionDetailsSuccess,
  getSectionDetailsFailure,
} from '../reducer/SubscriptionReducer';
import { getApi, postApi } from '../../utils/helper/ApiRequest';

const getItems = (state: any) => state.AuthReducer;

export function* purchaseSubscriptionSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };

  try {
    const response: ApiResponse = yield call(
      postApi,
      'user/subscription/purchase',
      action.payload,
      header,
    );

    yield put(purchaseSubscriptionSuccess(response?.data));
  } catch (error: any) {
    yield put(purchaseSubscriptionFailure(error));
    ToastAlert(
      error?.response?.data?.message || 'Purchase subscription failed',
    );
  }
}

export function* myCurrentSubscriptionSaga(): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };

  try {
    const response: ApiResponse = yield call(
      getApi,
      'my-current-subscription',
      header,
    );

    yield put(myCurrentSubscriptionSuccess(response?.data));
  } catch (error: any) {
    yield put(myCurrentSubscriptionFailure(error));
    ToastAlert(
      error?.response?.data?.message || 'My current subscription failed',
    );
  }
}

export function* subscriptionsSaga(): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };

  try {
    const response: ApiResponse = yield call(
      getApi,
      'subscriptions',
      header,
    );

    yield put(subscriptionsSuccess(response?.data?.data));
  } catch (error: any) {
    yield put(subscriptionsFailure(error));
    ToastAlert(error?.response?.data?.message || 'Subscriptions failed');
  }
}

export function* getSectionDetailsSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };

  try {
    const type_id = action.payload?.type_id || '';
    const response: ApiResponse = yield call(
      getApi,
      `dashboard/section-details?type_id=${type_id}`,
      header,
    );

    yield put(getSectionDetailsSuccess(response?.data?.data?.result
    ));
    console.log('112', response?.data?.data?.result)
  } catch (error: any) {
    yield put(getSectionDetailsFailure(error));
    ToastAlert(
      error?.response?.data?.message || 'Get section details failed',
    );
  }
}

export function* watchSubscriptionSaga(): Generator<any, void, any> {
  yield takeLatest(
    'Subscription/purchaseSubscriptionRequest',
    purchaseSubscriptionSaga,
  );
  yield takeLatest(
    'Subscription/myCurrentSubscriptionRequest',
    myCurrentSubscriptionSaga,
  );
  yield takeLatest('Subscription/subscriptionsRequest', subscriptionsSaga);
  yield takeLatest('Subscription/getSectionDetailsRequest', getSectionDetailsSaga);
}
