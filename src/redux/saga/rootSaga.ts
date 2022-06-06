import { all, fork } from 'redux-saga/effects';
import { watchUpdateAppExt } from './appConfigSaga';
import { watchUpdateLoginDTO } from './userInfoSaga';

export function* rootSaga() {
  yield all([fork(watchUpdateAppExt), fork(watchUpdateLoginDTO)]);
}
