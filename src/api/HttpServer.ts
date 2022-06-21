// @ts-ignore
import RNFetchBlob from 'rn-fetch-blob';
import cleaner from 'deep-cleaner';
import { serverDomain } from './config/serverDomain';
import { currentEnvironment } from './config/serverEnvironment';
import { serverInterceptor } from './config/serverInterceptor';
import { FetchInfo, BaseResponse } from './FetchInfo';
import { headerFieldValueDictionary } from './HeaderFieldValueDictionary';
import { netUtil } from './NetUtil';

class HttpServer {
  public promiseFetch<T>(fetchInfo: FetchInfo): Promise<BaseResponse<T>> {
    const { timeout } = fetchInfo;
    return this.promiseFetchWithTimeout<T>(
      this.promiseFetchNet(fetchInfo),
      timeout
    );
  }

  /**
   * 解决fetch没有timeout的问题
   */
  private async promiseFetchWithTimeout<T>(
    fetchPromise: any,
    timeout: number
  ): Promise<BaseResponse<T>> {
    let abort: (() => void) | null = null;
    const abortPromise = new Promise((resolve, reject) => {
      abort = () => {
        this.resolveError(resolve, -1, '请求超时');
      };
    });
    const racePromise = Promise.race([fetchPromise, abortPromise]);
    setTimeout(() => {
      abort?.();
    }, timeout);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return racePromise;
  }

  public async promiseFetchNet<T>(
    fetchInfo: FetchInfo
  ): Promise<BaseResponse<T>> {
    return new Promise((resolve, reject) => {
      const { data, method, header, timeout } = fetchInfo;
      const urlString = this.urlWithBaseUrl(fetchInfo);
      let requestUrl = urlString;
      // 处理请求头
      if (header) {
        Object.assign(headerFieldValueDictionary, header);
      }
      // 处理参数
      let requestParams = null;
      const cleanData = data ? cleaner(data) : null;
      if (cleanData) {
        if (method === 'GET') {
          requestUrl = this.getRequestUrl(requestUrl, cleanData);
        } else {
          requestParams = cleanData;
        }
      }

      const requestParam = {
        method,
        headers: headerFieldValueDictionary,
        timeout,
      };
      const postParam = {
        ...requestParam,
        body: this.transformObjToFormData(requestParams),
      };
      const request = method === 'GET' ? requestParam : postParam;
      fetch(requestUrl, request)
        .then((response: any) => {
          if (response.ok) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return response.json();
          } else {
            this.resolveError(resolve, response.status, response.statusText);
          }
        })
        .then((json: any) => {
          const currentInterceptor = serverInterceptor[currentEnvironment];
          if (!currentInterceptor) {
            this.resolveSuccuss(resolve, json);
            return;
          }
          if (currentInterceptor.interceptorResponse) {
            const { isIntercept, msg } = currentInterceptor.interceptorResponse(
              json,
              fetchInfo
            );
            if (isIntercept) {
              this.resolveError(resolve, -1, msg);
              return;
            }
          }
          if (currentInterceptor.handlerResponseData) {
            const resultData = currentInterceptor.handlerResponseData(json);
            this.resolveSuccuss(resolve, resultData);
          } else {
            this.resolveSuccuss(resolve, json);
          }
        })
        .catch((newError: any) => {
          this.resolveError(resolve, -1, newError);
        });
    });
  }

  /**
   *
   * @param params 转换参数
   */
  private transformObjToFormData = (params: any) => {
    const formData = new FormData();
    if (formData) {
      for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
          formData.append(key, params[key]);
        }
      }
    }
    return formData;
  };

  /**
   * 图片上传使用RNFetchBlob，其他不好使
   */
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
          this.resolveError(resolve, -1, newError);
        });
    });
  }

  private resolveError = (resolve: any, code: number, newError: string) => {
    resolve({
      success: false,
      data: undefined,
      error: { code, msg: newError },
    });
  };

  private resolveSuccuss = (resolve: any, data: any) => {
    resolve({
      success: true,
      ...data,
    });
  };

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
