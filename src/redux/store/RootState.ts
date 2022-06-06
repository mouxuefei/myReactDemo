import { CheckInState } from '../modules/checkIn';
import { UserInfoState } from '../modules/userInfo';

/**
 * redux整个结构，没算上其他模块的
 * 使用type好像开发体验要好一些，能不跳转的情况下就知道有哪些字段
 */
export type RootState = {
  userInfo: UserInfoState;
  checkIn: CheckInState;
};
