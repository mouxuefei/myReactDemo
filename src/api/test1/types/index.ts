export type OnStart = () => void;
export type OnErrorBase = (message: string) => { handled: boolean; message: string };
export type OnCommonError = (message: string) => void;
export type OnAlertError = (code: string, message: string) => void;
export type OnSuccess<T> = (data: T) => void;

export interface IRequestCallBack<T> {
    onStart: OnStart;
    onErrorBase?: OnErrorBase;
    onFailed: OnCommonError;
    onNetworkError?: OnCommonError;
    onAlertError?: OnAlertError; // 目前没有使用
    onSuccess: OnSuccess<T>;
}

export interface Encrypt {
    fullApiPath: string; // 完整接口地址
    token: string; // token
    needEncrypt: boolean; // 接口是否需要加密
    p: string;
    key: string;
    r: string;
    sign: string;
    timestamp: string;
}

export interface BaseServerData<T> {
    code: string;
    msg: string;
    toke: string;
    url: string;
    data: T;
}
