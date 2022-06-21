import { put, select, take, takeLatest } from 'redux-saga/effects';
import { updateAppExt, usingPrehost } from '../modules/actions';
import { RootState } from '../store/RootState';

function* onActionUsingPrehost() {
  // appContainer.getApi().update({ usingPrehost: true });
  // const rootState: RootState = yield select();
  // const { appExt } = rootState.appConfig;
  // if (appExt) {
  //   // TODO: 不晓得对不对，是以前的逻辑，需要测一下
  //   const newAppExtDTO = {
  //     ...appExt,
  //     baseHost: appExt.preBaseHost,
  //     webHost: appExt.preWebHost,
  //   };
  //   yield put(updateAppExt(newAppExtDTO));
  // }
}

export function* watchUsingPrehost() {
  yield takeLatest(usingPrehost.getType(), onActionUsingPrehost);
}
