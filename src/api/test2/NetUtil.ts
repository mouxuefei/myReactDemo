import { headerFieldValueDictionary } from './HeaderFieldValueDictionary';

class NetUtil {
  public isEmptyObject = (param: object) => {
    return !param || JSON.stringify(param) === '{}';
  };

  public setHeaders = (headers: object) => {
    Object.assign(headerFieldValueDictionary, headers);
  };
}

export const netUtil: NetUtil = new NetUtil();
