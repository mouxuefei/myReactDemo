import { defaultFetchInfo } from '../../../api/test2';

export class HomeFI {
  static article() {
    return defaultFetchInfo({
      url: '/article/list/0/json',
      method: 'GET',
    });
  }
}
