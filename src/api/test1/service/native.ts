import { NativeModules } from 'react-native';
import { Encrypt } from '../types/request';
import {
  IDCardFrontResult,
  IDCardBackResult,
  FaceResult,
  PickerItem,
} from '../types/card-face-recognition';
import { Address, Contact } from '../types/entity';

const RNNativeModule = NativeModules.RNNativeModule;

export const QiNiuBucket = 'xinyongfu';

/**
 * 网络请求参数使用Native进行加密
 * @param path
 * @param params
 */
export function requestEncrypt(path: string, params: object): Promise<Encrypt> {
  return new Promise((resolve, reject) => {
    RNNativeModule.requestEncrypt(
      path,
      params,
      (err: string, result: Encrypt) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

/**
 * 网络返回的某些特殊code交由原生处理
 * @param code （10400，10401，10402）
 * @param message
 */
export function handAlertError(code: string, message: string): void {
  RNNativeModule.handAlertError(code, message);
}

/**
 * 转圈动画
 * @param message
 */

export function showToastLoading(message?: string): void {
  RNNativeModule.showToastLoading(message);
}

/**
 * 取消转圈动画
 */
export function hideToastLoading(): void {
  RNNativeModule.hideToastLoading();
}

/**
 * 识别身份证前面
 */
export function readIDCardFront(): Promise<IDCardFrontResult> {
  return new Promise((resolve, reject) => {
    RNNativeModule.readIDCardFront((err: string, result: IDCardFrontResult) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

/**
 * 识别身份证后面
 */
export function readIDCardBack(): Promise<IDCardBackResult> {
  return new Promise((resolve, reject) => {
    RNNativeModule.readIDCardBack((err: string, result: IDCardBackResult) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

/**
 * 人脸识别
 */
export function faceRecognition(): Promise<FaceResult> {
  return new Promise((resolve, reject) => {
    RNNativeModule.faceRecognition((err: string, result: FaceResult) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

/**
 * 打开只有一项的picker // Android Only
 */
export function openPickerView(
  list: PickerItem[],
  title: String,
  label: String
): Promise<PickerItem> {
  return new Promise((resolve, reject) => {
    RNNativeModule.openPicker(
      list,
      title,
      label,
      (err: string, result: PickerItem) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

/*
 *  关闭当前Activity or ViewController
 */
export function finishRNContainer(data: object | null = {}) {
  RNNativeModule.finishRNContainer(data);
}

/*
 *  跳转到添加银行卡界面
 */
export function gotoAddBankCardPage() {
  RNNativeModule.gotoAddBankCardActivity();
}

/**
 * 选取或者拍摄照片
 * @param pickImage  从相册选取图片、直接拍摄照片  true 表示从相册选图片 false表示拍照
 *
 * result 图片地址
 *
 */
export async function pickOrTakePhoto(pickImage: boolean): Promise<any> {
  return new Promise((resolve, reject) => {
    RNNativeModule.pickOrTakePhoto(pickImage, (err: string, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
/**
 * 获取token
 */
export async function getToken(): Promise<string> {
  return new Promise(resolve => {
    RNNativeModule.getToken((result: string) => {
      resolve(result);
    });
  });
}
/**
 * 上传图片到七牛
 * @param base64Image 需要上传的图片的base64字符串
 */
export async function qiniuUpload(base64Image: string): Promise<string> {
  return new Promise((resolve, reject) => {
    RNNativeModule.qiniuUpload(base64Image, (err: string, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

/**
 * 批量上传图片到七牛
 * @param base64Images 需要上传的图片的base64字符串数组
 */
export async function qiniuUploadImages(
  base64Images: string[]
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    RNNativeModule.qiniuUpload(base64Images, (err: string, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

/**
 * 显示省市区picker
 */
export async function showAddressPicker(): Promise<Address> {
  return new Promise(resolve => {
    RNNativeModule.showAddressPicker((result: Address) => {
      resolve(result);
    });
  });
}

/**
 * 选取联系人
 * result = { name,phoneNum }
 */
export async function pickContact(): Promise<Contact> {
  return new Promise((resolve, reject) => {
    RNNativeModule.pickContact((err: string, result: Contact) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
