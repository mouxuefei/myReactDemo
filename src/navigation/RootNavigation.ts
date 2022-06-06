import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

/**
 * 全局可使用的路由
 * @param name screenKey
 * @param params 参数
 */
export const navigate = (name: any, params: any) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};
