import {
  getSystemName,
  getSystemVersion,
  getModel,
  getVersion,
  getUserAgent,
} from 'react-native-device-info';

const userAgent = {
  systemName: getSystemName(), // 设备系统类型iOS或android
  systemVersion: getSystemVersion(), // 设备系统版本如，'4.0'
  model: encodeURIComponent(getModel()), // 设备名iPhone X
  appVersion: getVersion(), // 应用的当前版本
  userAgent: getUserAgent(),
};

export const headerFieldValueDictionary = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'TM-Header-CurTime': new Date().getTime().toString().substr(0, 10),
  userAgent: JSON.stringify(userAgent),
};
