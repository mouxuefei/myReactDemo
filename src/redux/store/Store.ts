import { createStore, IExtension, IModuleStore } from 'redux-dynamic-modules';
import { getSagaExtension } from 'redux-dynamic-modules-saga';
import { getThunkExtension } from 'redux-dynamic-modules-thunk';
import reducer from '../modules/index';
import { rootSaga } from '../saga/rootSaga';
import { RootState } from './RootState';
/**
 * 整个store
 */
let privateStore: IModuleStore<RootState> | undefined = undefined;

export function getStore() {
  return privateStore;
}
const baseModule = {
  id: 'base',
  reducerMap: {
    ...reducer,
  },
  sagas: [rootSaga],
};

const extensions = [getSagaExtension(), getThunkExtension()];

export const store: any = createStore({ extensions }, baseModule);

privateStore = store;
