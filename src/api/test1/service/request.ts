import { BaseServerData, IRequestCallBack } from '../types/request';
import service from '.';

export interface TypedResponse<T = any> extends Response {
  json<P = T>(): Promise<P>;
}

/**
 *
 * @param error
 * @param callback
 */

function _errorHandle<T>(error: any, callback: IRequestCallBack<T>) {
  let callValue = false;
  let errorMessage = error;
  if (callback.onErrorBase) {
    const { handled, message } = callback.onErrorBase(error);
    callValue = handled;
    errorMessage = message;
  }
  if (!callValue) {
    const errorArray = error.message.split('_'); // 字符分割
    if (errorArray.length === 3) {
      if (
        errorArray[1] === '10400' || // token失效
        errorArray[1] === '10401' || // 安全验证失效
        errorArray[1] === '10402' // 抢登
      ) {
        callback.onFailed(errorArray[2]);
        // service.native.handAlertError(errorArray[1], errorArray[2]);
      } else if (errorArray[1] === '10403') {
        // 登录超时
      } else if (errorArray[1] === '10404') {
        // 普通错误
        callback.onFailed(errorArray[2]);
      } else {
        callback.onFailed(errorArray[2]);
      }
    } else {
      callback.onFailed(errorArray[0]);
    }
  } else {
    callback.onFailed(errorMessage);
  }
}

/**
 *
 * @param fetch
 * @param callback
 */
export function requestApi<T>(
  fetch: Promise<TypedResponse<BaseServerData<T>>>,
  callback: IRequestCallBack<T>
) {
  callback.onStart();

  return fetch
    .then((response: TypedResponse<BaseServerData<T>>) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('服务器出错');
      }
    })
    .then((baseData: BaseServerData<T>) => {
      if (baseData.code !== '10000') {
        throw new Error(`ERRORTAG_${baseData.code}_${baseData.msg}`);
      } else {
        return baseData.data;
      }
    })
    .then((data: T) => {
      console.log(data);
      callback.onSuccess(data);
    })
    .catch(error => {
      _errorHandle(error, callback);
    });
}
