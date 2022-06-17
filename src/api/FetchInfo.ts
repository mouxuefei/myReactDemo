type Methods =
  | 'POST'
  | 'GET'
  | 'DELETE'
  | 'PUT'
  | 'post'
  | 'get'
  | 'delete'
  | 'put';

export const defaultFetchInfo = (info: {
  url: string;
  data?: object;
  method?: Methods;
  timeout?: number;
  header?: object;
  distinctUser?: boolean;
}): FetchInfo => {
  const fetchInfo: FetchInfo = {
    url: info.url,
    method: info.method != null ? info.method : 'POST',
    timeout: info.timeout != null ? info.timeout : 30000,
    data: info.data != null ? info.data : null,
    header: info.header != null ? info.header : null,
    distinctUser: info.distinctUser != null ? info.distinctUser : false,
  };
  return fetchInfo;
};

export type FetchInfo = {
  url: string;
  method: Methods;
  timeout: number;
  data?: object | null;
  header?: object | null;
  /**
   * 区分用户主要用于缓存，缓存的时候带上用户id
   */
  distinctUser?: boolean | null;
  /**
   * 文件上传信息
   */
  fileInfo?: FileInfo;
};

/**
 * 文件信息，用于需要传文件的接口
 */
export interface FileInfo {
  /**
   * 文件名，会自动转为全小写
   */
  name: string;
  /**
   * 文件本地路径
   */
  localPath: string;
  /**
   * 文件类型，暂时只有image
   */
  fileType?: 'image';
}

/**
 * 请求完成的基类
 */
export interface BaseResponse<T> {
  success: boolean;
  data?: T;
  error: netError;
}

export interface netError {
  code?: number;
  msg?: string;
}
