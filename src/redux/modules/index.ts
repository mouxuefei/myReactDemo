import { checkInReducer } from './checkIn';
import { userInfoReducer } from './userInfo';

export * from './userInfo';
export * from './actions';
export * from './checkIn';

const rootReducer = {
  userInfo: userInfoReducer,
  checkIn: checkInReducer,
};

// eslint-disable-next-line import/no-default-export
export default rootReducer;
