import { all, fork } from 'redux-saga/effects';
import { watchUsingPrehost } from './appConfigSaga';
import { watchUpdateLoginDTO } from './userInfoSaga';

export function* rootSaga() {
  yield all([fork(watchUsingPrehost), fork(watchUpdateLoginDTO)]);
}
