import { FetchInfo } from '../FetchInfo';

export const serverInterceptor = {
  dev: {
    interceptorResponse: (json: any, fetchInfo: FetchInfo) => {
      // TODO: 这里拦截处理需要的逻辑
      return { isIntercept: false, message: '成功了', error: {} };
    },
    handlerResponseData: (json: any): any => {
      console.log('NetWork----->', JSON.stringify(json));
      return json;
    },
  },
  test: null,
  production: null,
};
