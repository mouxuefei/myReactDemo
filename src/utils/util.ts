import { Dimensions, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

/**
 * 验证身份证号码
 */
export const isValidIDCardNumber = (idCardNumber?: string): boolean => {
  if (idCardNumber) {
    // https://github.com/rlmao/idcard-check
    const reg =
      /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    const result = reg.test(idCardNumber);
    return result;
  }
  return false;
};

/**
 * 验证手机号码
 */
export const isValidPhoneNumber = (phoneNumber?: string): boolean => {
  if (phoneNumber) {
    const reg = /^1\d{10}$/;
    const result = reg.test(phoneNumber);
    return result;
  }
  return false;
};

/**
 * 验证域名bookln.cn 或者 zhizhuma.com
 * 是否为http链接，如果是则改为https
 */
export const httpChange = (url?: string): string | undefined => {
  if (url) {
    const reg =
      /(http)(:\/\/)([\w.!@#$%^&*()_+-=])*(bookln\.cn|zhizhuma\.com)([\w.!@#$%^&*()_+-=])*\s/;
    const result = reg.test(url);
    if (result) {
      const changeReg = /(http:)/;
      return url.replace(changeReg, 'https:');
    }
  }
  return url;
};

export const formatBytes = (bytes: number, decimals?: number) => {
  if (bytes === 0) return '0 M';
  const k = 1024,
    dm = decimals || 2,
    sizes = ['B', 'K', 'M', 'G'];
  let i = Math.floor(Math.log(bytes) / Math.log(k));
  if (i === 0 || i === 1) {
    // 使其最小单位为M
    i = 2;
  }
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

/**
 * 剩余多少时间
 * - 剩余25小时，返回：1天
 * - 剩余50小时，返回：2天
 * - 剩余23小时，返回：23小时
 * - 剩余90分钟，返回：1小时
 * - 剩余30分钟，返回：30分钟
 * - 剩余50秒，返回：0分钟
 */
export const timeRemaining = (endTime: number): string | undefined => {
  const now = Date.now();
  const time = endTime - now;
  if (time <= 0) {
    return undefined;
  } else {
    const oneSecond = 1000;
    const oneMinute = oneSecond * 60;
    const oneHour = oneMinute * 60;
    const oneDay = oneHour * 24;

    const days = Math.floor(time / oneDay);
    if (days > 1) {
      return `${days}天`;
    }

    const hours = Math.floor(time / oneHour);
    if (hours > 1) {
      return `${hours}小时`;
    }

    const minutes = Math.floor(time / oneMinute);
    return `${minutes}分钟`;
  }
};

export const formatSurplusTime = (time: number): string => {
  const timeObj = getSurplusTime(time);
  const { day, hour, minute, second } = timeObj;
  const addZeroMaybe = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`;
  };
  if (day === 0) {
    return [hour, minute, second].map(addZeroMaybe).join(':');
  }
  return `${day} 天 ${addZeroMaybe(hour)} 时 ${addZeroMaybe(
    minute
  )} 分 ${addZeroMaybe(second)} 秒`;
};

export const getSurplusTime = (time: number) => {
  const times = time - Date.now();
  const day = Math.floor(times / (24 * 60 * 60 * 1000));
  const hour = Math.floor(times / (1000 * 3600)) - day * 24;
  const minute = Math.floor(times / (1000 * 60)) - day * 24 * 60 - hour * 60;
  const second =
    Math.floor(times / 1000) -
    day * 24 * 60 * 60 -
    hour * 60 * 60 -
    minute * 60;
  return { day, hour, minute, second };
};

export function formatPrice(
  price: number | string | null | undefined,
  num: number = 2
) {
  let innerPrice = price;
  if (typeof innerPrice !== 'number') {
    if (innerPrice == null) {
      innerPrice = 0;
    } else {
      innerPrice = Number(innerPrice);
    }
  }
  return (innerPrice / 100).toFixed(num);
}

/**
 *返回整数的分秒值
 * @param {*} time
 */
export function formatTimeFixed(time: number) {
  const s = parseInt((time % 60).toFixed(0));
  const m = Math.floor(time / 60);
  const minuteStr = m < 10 ? `0${m}` : `${m}`;
  const secondsStr = s < 10 ? `0${s}` : `${s}`;
  return `${minuteStr}:${secondsStr}`;
}

export function isEmptyObj(obj: any) {
  return Object.keys(obj).length === 0;
}

const numMap = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const scale1 = ['', '十', '百', '千'];
const scale2 = ['', '万', '亿', '兆'];

export function num2Chinese(numParam: number) {
  if (Number.isNaN(numParam)) {
    return numParam;
  }
  const num = Array.from(numParam.toString());
  const numList = [];
  const scaleList = [];
  let res = '';
  // eslint-disable-next-line no-restricted-syntax
  for (const digit of num) {
    numList.push(numMap[Number(digit)]);
  }
  // @ts-ignore
  const maxScale = parseInt((num.length - 1) / scale1.length);
  for (let i = (num.length - 1) % scale1.length; i > 0; --i) {
    scaleList.push(scale1[i]);
  }
  for (let i = maxScale; i > 0; --i) {
    scaleList.push(scale2[i]);
    for (let j = scale1.length - 1; j > 0; --j) {
      scaleList.push(scale1[j]);
    }
  }
  for (let index = 0; index < numList.length; ++index) {
    if (numList[index] === '零') {
      res += numList[index];
      // @ts-ignore
      // eslint-disable-next-line no-continue
      continue;
    }
    res += numList[index];
    if (scaleList[index]) {
      res += scaleList[index];
    }
  }
  if (res[0] === '一' && res[1] === '十') {
    res = res.replace(/^一/, '');
  }
  res = res.replace(/零+/, '零'); // 合并连续的‘零’
  res = res.replace(/零$/, ''); // 删除末尾的‘零’
  return res;
}

/**
 * string转base64
 * @param {} input
 */
export function str2b64(input: string) {
  const b64pad = '';
  const tab =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let output = '';
  const len = input.length;
  for (let i = 0; i < len; i += 3) {
    const triplet =
      // eslint-disable-next-line no-bitwise
      (input.charCodeAt(i) << 16) |
      // eslint-disable-next-line no-bitwise
      (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) |
      (i + 2 < len ? input.charCodeAt(i + 2) : 0);
    for (let j = 0; j < 4; j++) {
      if (i * 8 + j * 6 > input.length * 8) output += b64pad;
      // eslint-disable-next-line no-bitwise
      else output += tab.charAt((triplet >>> (6 * (3 - j))) & 0x3f);
    }
  }
  return output;
}

function leastDouble(num: number): string {
  return num < 10 ? `0${num}` : num.toString();
}

export function formatDuration(timeSec: number): string {
  const totalSeconds = timeSec;

  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const hours = Math.floor(totalSeconds / 3600);
  if (hours > 0) {
    return `${leastDouble(hours)}:${leastDouble(minutes)}:${leastDouble(
      seconds
    )}`;
  } else {
    return `${leastDouble(minutes)}:${leastDouble(seconds)}`;
  }
}

// 大于等于10000的价格转换为一位小数+万
export function formatNumberToUnitW(number: number) {
  if (number < 10000) {
    return number;
  } else {
    return `${(number / 10000).toFixed(1)}万`;
  }
}

// 判断设备是否是oppo
export function isDeviceOppo() {
  const brand = DeviceInfo.getBrand();
  return (
    Platform.OS === 'android' &&
    brand != null &&
    brand.toLowerCase().includes('oppo')
  );
}

export function isIphoneX() {
  const wind = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (wind.height === 812 || wind.width === 812)
  );
}
