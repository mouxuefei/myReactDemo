import service from '../service';
import { BaseServerData } from '../types/';
import { TypedResponse } from '../service/request';

/**
 * 把参数对象转换成fetch body参数
 * @param params
 */
function transformObjToFormData(params: any) {
  const formData = new FormData();
  if (formData) {
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        formData.append(key, params[key]);
      }
    }
  }
  return formData;
}

/**
 *
 * @param method
 * @param path
 * @param params
 */
async function request<T>(
  method: string,
  path: string,
  params: any
): Promise<TypedResponse<BaseServerData<T>>> {
  try {
    const initHeaders = new Headers();
    initHeaders.append('Accept', 'application/json');
    initHeaders.append('version', service.system.getInfo().appVersion);
    initHeaders.append('platform', 'android');

    const encryptParams = await service.native.requestEncrypt(path, params);

    if (encryptParams) {
      if (encryptParams.needEncrypt) {
        return fetch(encryptParams.fullApiPath, {
          method,
          headers: initHeaders,
          body: transformObjToFormData({
            token: encryptParams.token,
            p: encryptParams.p,
            key: encryptParams.key,
            r: encryptParams.r,
            sign: encryptParams.sign,
            timestamp: encryptParams.timestamp,
          }),
        });
      } else {
        return fetch(encryptParams.fullApiPath, {
          method,
          headers: initHeaders,
          body: transformObjToFormData({
            token: encryptParams.token,
          }),
        });
      }
    } else {
      return new Promise((resolve, reject) => {
        reject(new Error('加密失败'));
      });
    }
  } catch (error) {
    return new Promise((resolve, reject) => {
      reject(new Error('加密失败'));
    });
  }
}
/**
 *
 * @param path
 * @param params
 */
export function post<T>(path: string, params: any = {}) {
  return request('POST', path, params);
}
/**
 *
 * @param path
 * @param params
 */
export function get<T>(path: string, params: any = {}) {
  return request<T>('GET', path, params);
}
