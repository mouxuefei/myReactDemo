import { Platform } from 'react-native';
import { createReducer } from 'redux-act';
import * as actions from './actions';
import { ThunkAction } from './actions';

export type UserInfoState = {
  loginDTO: any;
  isGuest: boolean;
  isIOSDeviceUser: boolean;
  byNowDays: number | undefined;
};

const initialState: UserInfoState = {
  loginDTO: undefined,
  isGuest: true,
  isIOSDeviceUser: false,
  byNowDays: undefined,
};

const userInfoReducer = createReducer<UserInfoState>({}, initialState);
userInfoReducer
  .on(actions.updateLoginDTO, (state, loginDTO) => {
    return {
      ...state,
      ...parseLoginDTO(loginDTO),
    };
  })
  .on(actions.updateLoginDTOInfo, (state, loginDTO) => {
    return {
      ...state,
      ...parseLoginDTO(loginDTO),
    };
  });

export { userInfoReducer };

const parseLoginDTO = (loginDTO: any) => {
  const { isGuest, isIOSDeviceUser } = judgeGuest(loginDTO);
  return {
    loginDTO,
    isGuest,
    isIOSDeviceUser,
  };
};

const judgeGuest = (loginDTO: any) => {
  let isIOSDeviceUser = false;
  let isGuest = true;
  if (loginDTO) {
    isGuest = loginDTO.userId === 25;
    if (Platform.OS === 'ios' && loginDTO.level) {
      isIOSDeviceUser = loginDTO.level === 5;
    }
  }
  return { isGuest, isIOSDeviceUser };
};

export function login(latestLoginDTO: any): ThunkAction {
  console.log('login=====');

  return dispatch => {
    dispatch(actions.updateLoginDTO(latestLoginDTO));
  };
}
