/* eslint-disable @typescript-eslint/no-use-before-define */
import { DeviceEventEmitter, Platform } from 'react-native';
import { delay, put, select, takeLatest } from 'redux-saga/effects';
import { updateLoginDTO } from '../modules/actions';
import { RootState } from '../store/RootState';

function* onUpdateLoginDTO() {
  console.log('saga===');

  const rootState: RootState = yield select();
  const { loginDTO } = rootState.userInfo;
  //   try {
  //     appContainer
  //       .getApi()
  //       .update({ _tid: loginDTO?.sessionId, userId: loginDTO?.userId });
  //   } catch (error) {
  //     //
  //   }

  //   if (previousUserId !== loginDTO?.userId) {
  //     previousUserId = loginDTO?.userId;
  //     yield onUserChanged(loginDTO);
  //   }
}

function* onUserChanged(loginDTO: any | null | undefined) {
  // if (loginDTO?.userId === guestLoginDTO.userId) {
  //   yield put(actionUpdateMyIdentity(null));
  //   yield put(updateMyPepBooks([]));
  //   yield put(updateStagesCategoriesMyCategory(null));
  //   yield put(updateMyBooks({ myBookDTOs: [], userId: loginDTO?.userId }));
  // }
  // yield put(initialMojiState());
  // fetchMyBooks({ userId: loginDTO?.userId ?? guestLoginDTO.userId });
  // // TODO: 首页MyCategory不能及时更新
  // try {
  //   const userCatRequest = UserClassifyFI.getusercat() as any;
  //   const userCatCachedResponse: YTResponse<any> = yield appContainer
  //     .getApi()
  //     .loadCache(userCatRequest);
  //   if (userCatCachedResponse.data) {
  //     yield put(updateStagesCategoriesMyCategory(userCatCachedResponse.data));
  //   }
  // } catch {}
  // DeviceEventEmitter.emit(notification.USER_ID_CHANGED_NOTIFICATION, loginDTO);
}

export function* watchUpdateLoginDTO() {
  yield takeLatest(updateLoginDTO.getType(), onUpdateLoginDTO);
}
