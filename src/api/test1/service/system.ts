import { Platform } from 'react-native';

export interface SystemCache {
  appVersion: string;
  ipAddress: string;
  mobileName: string;
  mobileNetwork: string;
  mobileSystem: string;
  mobileUuid: string;
  mobileVersion: string;
  statusHeight: string;
  statusHeightDP: number; // android专用，单位dp
  isIphoneX?: boolean; // 是否有刘海，ios only
  channel?: string;
  merchantId: string; // 商户id
}

let _cache: any = {};

export function setInfo(info: SystemCache) {
  _cache = { ...info };

  if (Platform.OS.toLowerCase() === 'ios') {
    _cache.isIphoneX = info.isIphoneX;
  }
  if (Platform.OS.toLowerCase() === 'android') {
    _cache.statusHeightDP = info.statusHeightDP;
  }
}

export function getInfo(): SystemCache {
  return _cache;
}
