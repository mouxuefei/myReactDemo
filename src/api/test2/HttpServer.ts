// @ts-ignore
import RNFetchBlob from 'rn-fetch-blob';
import { serverDomain } from './config/serverDomain';
import { currentEnvironment } from './config/serverEnvironment';
import { serverInterceptor } from './config/serverInterceptor';
import { FetchInfo, BaseResponse } from './FetchInfo';
import { headerFieldValueDictionary } from './HeaderFieldValueDictionary';
import { netUtil } from './NetUtil';

class HttpServer {
  public async promiseFetch<T>(fetchInfo: FetchInfo): Promise<BaseResponse<T>> {
    return new Promise((resolve, reject) => {
      const { data, method, header, timeout } = fetchInfo;
      const urlString = this.urlWithBaseUrl(fetchInfo);
      let requestUrl = urlString;
      // 配置请求头
      if (header) {
        Object.assign(headerFieldValueDictionary, header);
      }
      // 参数
      let requestParams = null;
      if (data && Array.isArray(data)) {
        requestParams = data;
      } else {
        if (data) {
          if (method === 'GET') {
            requestUrl = this.getRequestUrl(requestUrl, data);
          } else {
            requestParams = JSON.stringify(data);
          }
        }
      }
      RNFetchBlob.config({
        trusty: true,
        timeout,
      })
        .fetch(method, requestUrl, headerFieldValueDictionary, requestParams)
        .then((resp: any) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return resp.json();
        })
        .then((json: any) => {
          const currentInterceptor = serverInterceptor[currentEnvironment];
          if (currentInterceptor) {
            if (currentInterceptor.interceptorResponse) {
              const { isIntercept, error: newError } =
                currentInterceptor.interceptorResponse(json, fetchInfo);
              if (isIntercept) {
                resolve({
                  success: false,
                  data: undefined,
                  error: newError,
                });
                return;
              }
            }

            if (currentInterceptor.handlerResponseData) {
              const resultData = currentInterceptor.handlerResponseData(json);
              resolve(resultData);
            } else {
              resolve(json);
            }
          } else {
            resolve(json);
          }
        })
        .catch((newError: any) => {
          resolve({
            success: false,
            data: undefined,
            error: { code: -1, msg: newError },
          });
        });
    });
  }

  public async promiseUploadFile(info: FetchInfo): Promise<any> {
    const urlString = this.urlWithBaseUrl(info);
    const fetchObject = [
      {
        name: 'file',
        filename: info?.fileInfo?.name,
        data: info?.data,
      },
    ];
    return new Promise((resolve, reject) => {
      RNFetchBlob.fetch(
        'POST',
        urlString,
        {
          'Content-Type': 'multipart/form-data',
        },
        fetchObject
      )
        .then((response: any) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return response.json();
        })
        .then((responseJson: any) => {
          resolve(responseJson);
        })
        .catch((newError: any) => {
          resolve({
            success: false,
            data: undefined,
            error: { code: -1, msg: newError },
          });
        });
    });
  }

  private getRequestUrl = (requestUrl: string, apiParams: any) => {
    if (netUtil.isEmptyObject(apiParams)) {
      return requestUrl;
    }
    const tempParams = [];
    if (!netUtil.isEmptyObject(apiParams)) {
      for (const strKey of Object.keys(apiParams)) {
        const param = `${strKey}=${apiParams[strKey]}`;
        tempParams.push(param);
      }
    }
    return encodeURI(
      tempParams.length === 0
        ? requestUrl
        : `${requestUrl}?${tempParams.join('&')}`
    );
  };

  private urlWithBaseUrl = (fetchInfo: FetchInfo) => {
    const { url } = fetchInfo;
    const requestUrl = `${serverDomain[currentEnvironment]}${url}`;
    return requestUrl;
  };
}

export const httpServer = new HttpServer();
