package com.unnamedemo.mvvm.view;

import android.os.Bundle;
import android.view.KeyEvent;

import com.facebook.infer.annotation.Assertions;
import com.facebook.react.PackageList;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.devsupport.DoubleTapReloadRecognizer;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import com.unnamedemo.BuildConfig;

import java.util.List;

import androidx.appcompat.app.AppCompatActivity;

public class RNPageActivity extends AppCompatActivity implements DefaultHardwareBackBtnHandler {
    private RNGestureHandlerEnabledRootView mReactRootView;
    private ReactInstanceManager mReactInstanceManager;
    private DoubleTapReloadRecognizer mDoubleTapReloadRecognizer;
    private Boolean mDeveloperSupport = BuildConfig.DEBUG;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(null);
        mDoubleTapReloadRecognizer = new DoubleTapReloadRecognizer();
        mReactRootView = new RNGestureHandlerEnabledRootView(this);
        //把所有的包给当前这个rn
        List<ReactPackage> packages = new PackageList(getApplication()).getPackages();
        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setCurrentActivity(this)
                .setBundleAssetName("index.android.bundle")
                .setJSMainModulePath("index")
                .addPackages(packages)
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();
        Bundle bundle = new Bundle();
        bundle.putString("data1", "android传递的初始化参数1");
        bundle.putString("data2", "android传递的初始化参数2");
        // 这个"App1"名字一定要和我们在index.js中注册的名字保持一致AppRegistry.registerComponent()
        mReactRootView.startReactApplication(mReactInstanceManager, "unNameDemo", bundle);
        setContentView(mReactRootView);
    }

    @Override
    public void invokeDefaultOnBackPressed() {

        super.onBackPressed();
    }

    @Override
    protected void onPause() {
        super.onPause();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostPause(this);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostResume(this, this);
        }
    }

    @Override
    public void onBackPressed() {
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onBackPressed();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostDestroy(this);
        }
        if (mReactRootView != null) {
            mReactRootView.unmountReactApplication();
        }
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (getUseDeveloperSupport()) {
            if (keyCode == KeyEvent.KEYCODE_MENU) {//Ctrl + M 打开RN开发者菜单
                mReactInstanceManager.showDevOptionsDialog();
                return true;
            }
            boolean didDoubleTapR = Assertions.assertNotNull(mDoubleTapReloadRecognizer).didDoubleTapR(keyCode, getCurrentFocus());
            if (didDoubleTapR) {//双击R 重新加载JS
                mReactInstanceManager.getDevSupportManager().handleReloadJS();
                return true;
            }
        }
        return super.onKeyUp(keyCode, event);
    }
    public boolean getUseDeveloperSupport() {
        return mReactInstanceManager!=null && mDeveloperSupport;
    }

}