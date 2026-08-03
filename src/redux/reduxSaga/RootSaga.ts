import { all, fork } from 'redux-saga/effects';
import { watchAuthSaga } from './AuthSaga';
import { watchMainSaga } from './MainSaga';
import { watchSongSaga } from './SongSaga';
import { watchSubscriptionSaga } from './SubscriptionSaga';

export default function* RootSaga(): Generator<any, void, any> {
  yield all([
    fork(watchAuthSaga),
    fork(watchMainSaga),
    fork(watchSongSaga),
    fork(watchSubscriptionSaga),
    // Add other sagas here
  ]);
}
