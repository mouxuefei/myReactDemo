import { getStore } from './ConfigureStore';

/**
 * 获取全局redux store。
 */
const globalStore = () => {
  /*
  以前是一个常量，现在改为了一个方法
  常量有一个最大的问题就是，应用初始化的时候就必须init好
  然而项目越来越复杂，必须初始化好store的这种操作会导致很多地方的初始化变得特别不灵活
  现在也加入了dependency injection，情况更复杂了
  项目中也有非常多的循环import，还有的地方必须保证import的顺序（如app.ts），否则就会报错
  各种启动、初始化放在一起的时候，感觉越来越不好控制
  改为方法之后，可以理解成是懒加载，可以在我们想初始化的地方初始化，而且还可以传入各种参数等
  initStore就显得非常灵活可控
  */

  return getStore();
};

export { globalStore };
