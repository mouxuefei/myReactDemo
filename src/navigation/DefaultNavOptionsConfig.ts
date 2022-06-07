export const defaultNavOptionsConfig: any = {
  headerShadowVisible: false, // android 导航去阴影 默认true开启状态
  headerTitleAlign: 'center', // 标题居中 默认 'left'
  headerTitle: '', // 全局标题 在此设置是不生效的 默认展示路由页面的name
  // 设置导航栏字体样式
  headerTitleStyle: {
    fontSize: 17,
    color: '#333333',
    fontFamily: 'PingFangSC-Semibold',
    fontWeight: '700',
  },
  headerTintColor: 'red', // 导航栏字体颜色设置 如果设置了headerTitleStyle则此处设置不生效
  statusBarStyle: 'dark', // "inverted" | "auto" | "light" | "dark" | undefined 状态栏配置
};
