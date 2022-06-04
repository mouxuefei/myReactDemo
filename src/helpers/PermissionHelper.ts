import { Alert, Platform } from 'react-native';
import {
  AndroidPermission,
  check,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

interface PermissionPurpose {
  description: string;
}

const { ANDROID } = PERMISSIONS;
const {
  ACCEPT_HANDOVER,
  ACCESS_BACKGROUND_LOCATION,
  ACCESS_COARSE_LOCATION,
  ACCESS_FINE_LOCATION,
  ACTIVITY_RECOGNITION,
  ADD_VOICEMAIL,
  ANSWER_PHONE_CALLS,
  BODY_SENSORS,
  CALL_PHONE,
  CAMERA,
  GET_ACCOUNTS,
  PROCESS_OUTGOING_CALLS,
  READ_CALENDAR,
  READ_CALL_LOG,
  READ_CONTACTS,
  READ_EXTERNAL_STORAGE,
  READ_PHONE_NUMBERS,
  READ_PHONE_STATE,
  READ_SMS,
  RECEIVE_MMS,
  RECEIVE_SMS,
  RECEIVE_WAP_PUSH,
  RECORD_AUDIO,
  SEND_SMS,
  USE_SIP,
  WRITE_CALENDAR,
  WRITE_CALL_LOG,
  WRITE_CONTACTS,
  WRITE_EXTERNAL_STORAGE,
} = ANDROID;

// TODO: 如何让 [key in AndroidPermission] 变成类似 Partial 的类型？

const allPurposes: {
  [key in AndroidPermission]: PermissionPurpose | undefined;
} = {
  [CAMERA]: {
    description: '授权您的相机权限，以便使用修改头像功能',
  },
  [ACCESS_FINE_LOCATION]: {
    description: '授权您的位置权限，以便发送带位置信息的墨迹',
  },
  [ACCESS_COARSE_LOCATION]: {
    description: '授权您的位置权限，以便发送带位置信息的墨迹',
  },
  [RECORD_AUDIO]: {
    description: '授权您的麦克风权限，以便使用口语听力的录音功能',
  },
  [READ_EXTERNAL_STORAGE]: {
    description:
      '授权您的照片访问权限，以便发送带图片的墨迹、私聊发送图片消息、修改头像功能',
  },
  [WRITE_EXTERNAL_STORAGE]: {
    description:
      '授权您的照片访问权限，以便发送带图片的墨迹、私聊发送图片消息、修改头像功能、保存图片到相册',
  },

  [ACCEPT_HANDOVER]: undefined,
  [ACCESS_BACKGROUND_LOCATION]: undefined,
  [READ_SMS]: undefined,
  [READ_PHONE_STATE]: undefined,
  [READ_PHONE_NUMBERS]: undefined,
  [READ_CONTACTS]: undefined,
  [READ_CALL_LOG]: undefined,
  [READ_CALENDAR]: undefined,
  [ACTIVITY_RECOGNITION]: undefined,
  [ADD_VOICEMAIL]: undefined,
  [ANSWER_PHONE_CALLS]: undefined,
  [BODY_SENSORS]: undefined,
  [CALL_PHONE]: undefined,
  [GET_ACCOUNTS]: undefined,
  [PROCESS_OUTGOING_CALLS]: undefined,
  [RECEIVE_MMS]: undefined,
  [RECEIVE_SMS]: undefined,
  [USE_SIP]: undefined,
  [SEND_SMS]: undefined,
  [RECEIVE_WAP_PUSH]: undefined,
  [WRITE_CALENDAR]: undefined,
  [WRITE_CALL_LOG]: undefined,
  [WRITE_CONTACTS]: undefined,
};

/**
 * 整改报告中的内容：`在申请打开可收集个人信息的权限，或申请收集用户身份证号、银行账号、行踪轨迹等个人敏感信息时，未同步告知用户其目的，或者目的不明确、难以理解。`
 *
 * 参考网易云音乐Android弹窗，简单做个Alert，重点在于`同步告知用户其目的`。
 * 不完美，但审查应该可以过。
 *
 * @see 【【整改】“书链”APP个人信息采集合规检测报告V1.0】 https://www.tapd.cn/21394591/prong/stories/view/1121394591001093213
 */
export class PermissionHelper {
  private static instance?: PermissionHelper;

  private constructor() {
    //
  }

  static shared(): PermissionHelper {
    if (PermissionHelper.instance == null) {
      PermissionHelper.instance = new PermissionHelper();
    }

    return PermissionHelper.instance;
  }

  /**
   * 在真正请求权限之前提示用户
   *
   * @param permission PERMISSIONS.ANDROID.XXX
   * @returns iOS始终返回true，Android用户点击「授权」、已授权、已拒绝，都返回true，未授权且用户点击「取消」的时候返回false
   */
  showUserPurpose = async (permission: AndroidPermission): Promise<boolean> => {
    return this.showUserPurposes([permission]);
  };

  /**
   * 在真正请求权限之前提示用户
   *
   * @param permissions [PERMISSIONS.ANDROID.XXX, PERMISSIONS.ANDROID.OOO]
   * @returns iOS始终返回true，Android用户点击「授权」、已授权、已拒绝，都返回true，未授权且用户点击「取消」的时候返回false
   */
  showUserPurposes = async (
    permissions: AndroidPermission[]
  ): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true;
    }

    const validPermissions = permissions.filter(permission => {
      return allPurposes[permission] != null;
    });
    const purposes = validPermissions.map(
      permission => allPurposes[permission]
    );
    if (purposes.length === 0) {
      throw new Error('权限描述为空，需要补充');
    }

    try {
      const results = await Promise.all(
        validPermissions.map(permission => check(permission))
      );

      const purposesToAlert = purposes.filter((_, index) => {
        const result = results[index];
        return result === RESULTS.DENIED || result === RESULTS.BLOCKED;
      });
      if (purposesToAlert.length > 0) {
        // 被拒绝，但是还可以申请
        const message = purposesToAlert
          .map(purpose => purpose?.description)
          .join('\n\n');
        return new Promise((resolve, _reject) => {
          Alert.alert('授权提示', message, [
            {
              text: '取消',
              onPress: () => {
                resolve(false);
              },
            },
            {
              text: '授权',
              onPress: () => {
                resolve(true);
              },
            },
          ]);
        });
      } else {
        // 被拒绝且无法再次申请、不可用、已授权
        return true;
      }
    } catch (error) {
      // 出错，继续往下执行
      return true;
    }
  };
}
