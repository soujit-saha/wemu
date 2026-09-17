import { call, put, select, takeLatest, takeEvery } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import ToastAlert from '../../utils/helper/Toast';
import { ApiHeaders, ApiResponse } from '../types';
import {
  increasePlayCountFailure,
  increasePlayCountSuccess,
  searchSongFailure,
  searchSongSuccess,
  createOrUpdatePlaylistFailure,
  createOrUpdatePlaylistSuccess,
  getMyPlaylistsFailure,
  getMyPlaylistsSuccess,
  addRemovePlaylistSongFailure,
  addRemovePlaylistSongSuccess,
  getPlaylistDetailsFailure,
  getPlaylistDetailsSuccess,
  getPlaylistDetailsRequest,
  deletePlaylistFailure,
  deletePlaylistSuccess,
  getAlbumsFailure,
  getAlbumsSuccess,
  getArtistsFailure,
  getArtistsSuccess,
  getSongsToAddFailure,
  getSongsToAddSuccess,
  getPlayerQueueFailure,
  getPlayerQueueSuccess,
  getSongsByAlbumFailure,
  getSongsByAlbumSuccess,
} from '../reducer/SongReducer';
import { getApi, postApi } from '../../utils/helper/ApiRequest';
import { goBack } from '../../utils/helper/RootNavigation';

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

export function* searchSongSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };

  try {
    const payload =
      typeof action.payload === 'string'
        ? { keywords: action.payload }
        : action.payload ?? {};

    const response: ApiResponse = yield call(
      postApi,
      'search',
      payload,
      header,
    );

    yield put(searchSongSuccess(response?.data));
  } catch (error: any) {
    yield put(searchSongFailure(error));
    ToastAlert(error?.response?.data?.message || 'Search failed');
  }
}

export function* createOrUpdatePlaylistSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const payload = action.payload;
  const isFormData = payload instanceof FormData;

  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: isFormData ? 'multipart/form-data' : 'application/json',
    accesstoken: item.getTokenResponse,
  };

  try {
    const response: ApiResponse = yield call(
      postApi,
      'playlist/create-or-update',
      payload,
      header,
    );

    yield put(createOrUpdatePlaylistSuccess(response?.data));
    ToastAlert(response?.data?.message || 'Playlist saved successfully');
    goBack();
  } catch (error: any) {
    yield put(createOrUpdatePlaylistFailure(error));
    ToastAlert(error?.response?.data?.message || 'Create playlist failed');
  }
}

const buildQuery = (payload: any) => {
  if (!payload || typeof payload !== 'object') return '';
  const query = Object.keys(payload)
    .filter(k => payload[k] !== undefined && payload[k] !== '')
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(payload[k])}`)
    .join('&');
  return query ? `?${query}` : '';
};

export function* getMyPlaylistsSaga(
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
      getApi,
      `playlist/my-playlists${buildQuery(action.payload)}`,
      header,
    );

    yield put(getMyPlaylistsSuccess(response?.data));
  } catch (error: any) {
    yield put(getMyPlaylistsFailure(error));
    ToastAlert(error?.response?.data?.message || 'Failed to fetch playlists');
  }
}

export function* addRemovePlaylistSongSaga(
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
      // 'playlist/add-remove-song',
      'playlist/bulk-add-remove-song',
      action.payload,
      header,
    );

    yield put(addRemovePlaylistSongSuccess(response?.data));
    ToastAlert(response?.data?.message || 'Playlist updated successfully');

    // Automatically fetch updated playlist details
    if (action.payload?.playlist_id) {
      yield put(getPlaylistDetailsRequest(action.payload.playlist_id));
    }
  } catch (error: any) {
    yield put(addRemovePlaylistSongFailure(error));
    ToastAlert(
      error?.response?.data?.message || 'Failed to update playlist song',
    );
  }
}

export function* getPlaylistDetailsSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };

  try {
    const playlistId =
      action.payload?.playlist_id ?? action.payload?.id ?? action.payload;
    const response: ApiResponse = yield call(
      getApi,
      `playlist/details/${playlistId}`,
      header,
    );

    yield put(getPlaylistDetailsSuccess(response?.data));
  } catch (error: any) {
    yield put(getPlaylistDetailsFailure(error));
    ToastAlert(
      error?.response?.data?.message || 'Failed to fetch playlist details',
    );
  }
}

export function* deletePlaylistSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };

  try {
    const playlistId =
      action.payload?.playlist_id ?? action.payload?.id ?? action.payload;
    const response: ApiResponse = yield call(
      getApi,
      `playlist/delete/${playlistId}`,
      header,
    );

    yield put(deletePlaylistSuccess(response?.data));
    ToastAlert(response?.data?.message || 'Playlist deleted successfully');
  } catch (error: any) {
    yield put(deletePlaylistFailure(error));
    ToastAlert(error?.response?.data?.message || 'Failed to delete playlist');
  }
}

export function* getAlbumsSaga(
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
      getApi,
      `albums${buildQuery(action.payload)}`,
      header,
    );

    yield put(getAlbumsSuccess(response?.data));
  } catch (error: any) {
    yield put(getAlbumsFailure(error));
    ToastAlert(error?.response?.data?.message || 'Failed to fetch albums');
  }
}

export function* getArtistsSaga(
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
      getApi,
      `artists${buildQuery(action.payload)}`,
      header,
    );

    yield put(getArtistsSuccess(response?.data));
  } catch (error: any) {
    yield put(getArtistsFailure(error));
    ToastAlert(error?.response?.data?.message || 'Failed to fetch artists');
  }
}

export function* getSongsToAddSaga(
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
      getApi,
      `playlist/songs-to-add${buildQuery(action.payload)}`,
      header,
    );

    yield put(getSongsToAddSuccess(response?.data));
  } catch (error: any) {
    yield put(getSongsToAddFailure(error));
    ToastAlert(
      error?.response?.data?.message || 'Failed to fetch songs to add',
    );
  }
}

export function* getPlayerQueueSaga(
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
      getApi,
      `player/queue${buildQuery(action.payload)}`,
      header,
    );

    yield put(getPlayerQueueSuccess(response?.data));
  } catch (error: any) {
    yield put(getPlayerQueueFailure(error));
    ToastAlert(
      error?.response?.data?.message || 'Failed to fetch player queue',
    );
  }
}

export function* getSongsByAlbumSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse,
  };

  try {
    const albumId = action.payload?.id ?? action.payload;
    const page = action.payload?.page || 1;
    const response: ApiResponse = yield call(
      getApi,
      `songs-by-album/${albumId}?page=${page}`,
      header,
    );

    yield put(getSongsByAlbumSuccess(response?.data));
  } catch (error: any) {
    yield put(getSongsByAlbumFailure(error));
    ToastAlert(
      error?.response?.data?.message || 'Failed to fetch songs by album',
    );
  }
}

export function* watchSongSaga(): Generator<any, void, any> {
  yield takeLatest('Song/increasePlayCountRequest', increasePlayCountSaga);
  yield takeLatest('Song/searchSongRequest', searchSongSaga);
  yield takeLatest(
    'Song/createOrUpdatePlaylistRequest',
    createOrUpdatePlaylistSaga,
  );
  yield takeLatest('Song/getMyPlaylistsRequest', getMyPlaylistsSaga);
  yield takeLatest(
    'Song/addRemovePlaylistSongRequest',
    addRemovePlaylistSongSaga,
  );
  yield takeLatest('Song/getPlaylistDetailsRequest', getPlaylistDetailsSaga);
  yield takeLatest('Song/deletePlaylistRequest', deletePlaylistSaga);
  yield takeLatest('Song/getAlbumsRequest', getAlbumsSaga);
  yield takeLatest('Song/getArtistsRequest', getArtistsSaga);
  yield takeLatest('Song/getSongsToAddRequest', getSongsToAddSaga);
  yield takeLatest('Song/getPlayerQueueRequest', getPlayerQueueSaga);
  yield takeLatest('Song/getSongsByAlbumRequest', getSongsByAlbumSaga);
}
