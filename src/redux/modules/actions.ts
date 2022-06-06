import { createAction } from 'redux-act';

export type ThunkAction = (
  dispatch: (any: any) => any,
  getState: () => any
) => any;

// actions
export const updateBaseInfo = createAction<any>('action_updateBaseInfo');
export const updateAppExt = createAction<any>('action_updateAppExt');
export const usingPrehost = createAction<boolean>('action_usingPrehost');

// UserInfo actions
export const updateLoginDTO = createAction<any>('update loginDTO');

// 更新是否已签到
export const updateDidCheckIn = createAction<boolean>('updateDidCheckIn');

// 更新是否签到操作正在进行中
export const updateIsCheckInInProgress = createAction<boolean>(
  'updateIsCheckInInProgress'
);

/**
 * 和updateLoginDTO这个action作区分
 *  此action为个人信息页面更新信息，头像，昵称，姓名，性别
 */
export const updateLoginDTOInfo = createAction<any>(
  'update updateLoginDTOInfo'
);
