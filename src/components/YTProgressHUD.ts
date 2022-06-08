// import { NativeModules, ToastAndroid, Platform } from 'react-native';

// export const YTProgressHUDMaskType = {
//   None: 1,
//   Clear: 2,
//   Black: 3,
// };

// const ProgressHUD = NativeModules.YTProgressHUD;
// /**
//  * 吐司超过十秒自动dissmiss，如果重新点击重新计时
//  */
// export class YTProgressHUD {
//   static currentTimeOut;
//   static show(progressHUDMaskType: number) {
//     if (!progressHUDMaskType) {
//       return ProgressHUD.show();
//     }
//     return ProgressHUD.showWithMaskType(progressHUDMaskType);
//   }

//   static showWithStatus(status?: null | string, progressHUDMaskType?: number) {
//     if (!progressHUDMaskType) {
//       return ProgressHUD.showWithStatus(status);
//     }
//     return ProgressHUD.showWithStatusAndMaskType(status, progressHUDMaskType);
//   }

//   static internalTime() {
//     this.currentTimeOut && clearTimeout(this.currentTimeOut);
//     this.currentTimeOut = setTimeout(() => {
//       this.dismiss();
//     }, 10000);
//   }

//   static showInfoWithStatus(
//     status?: null | string,
//     progressHUDMaskType?: number
//   ) {
//     this.internalTime();
//     if (!progressHUDMaskType) {
//       if (Platform.OS === 'ios') {
//         return ProgressHUD.showInfoWithStatus(status);
//       } else {
//         ProgressHUD.dismiss();
//         return ToastAndroid.showWithGravity(
//           status,
//           ToastAndroid.SHORT,
//           ToastAndroid.CENTER
//         );
//       }
//     }
//     return ProgressHUD.showInfoWithStatusAndMaskType(
//       status,
//       progressHUDMaskType
//     );
//   }

//   static showSuccessWithStatus(
//     status?: null | string,
//     progressHUDMaskType?: number
//   ) {
//     this.internalTime();
//     if (!progressHUDMaskType) {
//       return ProgressHUD.showSuccessWithStatus(status);
//     }
//     return ProgressHUD.showSuccessWithStatusAndMaskType(
//       status,
//       progressHUDMaskType
//     );
//   }

//   static showErrorWithStatus(
//     status?: null | string,
//     progressHUDMaskType?: number
//   ) {
//     this.internalTime();
//     if (!progressHUDMaskType) {
//       return ProgressHUD.showErrorWithStatus(status);
//     }
//     return ProgressHUD.showErrorWithStatusAndMaskType(
//       status,
//       progressHUDMaskType
//     );
//   }

//   static showProgressWithStatus(
//     progress: number,
//     status?: null | string,
//     progressHUDMaskType?: number
//   ) {
//     if (!progressHUDMaskType) {
//       return ProgressHUD.showProgressWithStatus(progress, status);
//     }
//     return ProgressHUD.showProgressWithStatusAndMaskType(
//       progress,
//       status,
//       progressHUDMaskType
//     );
//   }

//   static dismiss() {
//     this.currentTimeOut && clearTimeout(this.currentTimeOut);
//     ProgressHUD.dismiss();
//   }

//   static dismissWithDelay(delayInSeconds: number) {
//     ProgressHUD.dismissWithDelay(delayInSeconds);
//   }
// }
