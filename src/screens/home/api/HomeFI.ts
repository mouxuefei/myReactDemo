import { defaultFetchInfo } from '../../../api';

export class HomeFI {
  static article() {
    return defaultFetchInfo({
      url: '/article/list/0/json',
      method: 'GET',
    });
  }
}
