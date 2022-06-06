import { put, select, take, takeLatest } from 'redux-saga/effects';
import { updateAppExt, usingPrehost } from '../modules/actions';
import { RootState } from '../store/RootState';

export function* watchUpdateAppExt() {
  // while (true) {
  //   yield take(updateAppExt.getType());
  //   const rootState: RootState = yield select();
  //   const { appExt } = rootState.appConfig;
  //   if (appExt) {
  //     // 切换环境
  //     try {
  //       // 可能还没有初始化好，try catch能够解决报错
  //       // 也就是暂时先忽略这行代码，网络请求初始化的时候会从redux里面获取，没问题
  //       const hostUtil = appContainer.getHostUtil();
  //       appContainer.getApi().switchEnv(hostUtil.getEnv(appExt.baseHost));
  //     } catch (error) {}
  //     yield native.saveAppExt(appExt);
  //     // 每一次都会save，不是太好，暂时影响不大
  //   }
  // }
}

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
