/*
 * @Author: jaybo
 * @Date: 2018-09-17 14:58:15
 * @Last Modified by: jaybo
 * @Last Modified time: 2019-06-24 14:26:46
 */

import { createReducer } from 'redux-act';
import * as actions from './actions';
import { ThunkAction } from './actions';

export type CheckInState = {
  didCheckIn: boolean; // 是否已经签到
  isCheckInInProgress: boolean; // 是否在签到中
};

/**
 * 初始化数据
 */
const initialState: CheckInState = {
  didCheckIn: false,
  isCheckInInProgress: false,
};

const checkInReducer = createReducer<CheckInState>({}, initialState);

checkInReducer.on(actions.updateDidCheckIn, (state, didCheckIn) => {
  console.log(`didCheckIn===${didCheckIn}`);
  return {
    ...state,
    didCheckIn,
  };
});
export { checkInReducer };

export const queryDidCheckIn = (
  callback: ((response: any) => void) | undefined
): ThunkAction => {
  return dispatch => {
    dispatch(actions.updateIsCheckInInProgress(true));

    //   const queryDidCheckInInfo = CrmCheckInFI.queryHasBeenCheckin();
    //   YTApi.fetch(queryDidCheckInInfo, (response: YTResponse) => {
    //     const didCheckIn = response.data || false;
    //     if (callback != null) {
    //       callback(response);
    //     }
    //     dispatch(actions.updateDidCheckIn(didCheckIn));
    //   });
  };
};

export const markCheckInAsCompleted = (): ThunkAction => {
  return dispatch => {
    dispatch(actions.updateIsCheckInInProgress(false));
  };
};
