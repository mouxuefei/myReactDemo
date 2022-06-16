package com.mou.basemvvm.integration

import android.app.Activity
import android.app.Application
import android.content.Context
import android.os.Bundle
import androidx.fragment.app.FragmentActivity
import androidx.fragment.app.FragmentManager

/***
 *
 * Created by mou on 2018/8/20.
 * 关于Application/Activity/Fragment的生命周期处理类
 */

class AppDelegate(context: Context) : AppLifeCycles {
    private var mApplication: Application? = null
    private var mModules: List<ConfigModule>? = null
    private var mAppLifeCycles: MutableList<AppLifeCycles> = arrayListOf()
    private var mActivityLifeCycles: MutableList<Application.ActivityLifecycleCallbacks> = arrayListOf()
    private var mFragmentLifeCycles: MutableList<FragmentManager.FragmentLifecycleCallbacks> = arrayListOf()

    override fun attachBaseContext(base: Context) {
        mAppLifeCycles.forEach {
            it.attachBaseContext(base)
        }
    }

    override fun onCreate(application: Application) {
        mApplication = application
        mApplication?.registerActivityLifecycleCallbacks(FragmentLifecycleCallbacks())
        mActivityLifeCycles.forEach {
            mApplication?.registerActivityLifecycleCallbacks(it)
        }
        mAppLifeCycles.forEach {
            if (mApplication != null) {
                it.onCreate(mApplication!!)
            }
        }

    }

    override fun onTerminate(application: Application) {
        mActivityLifeCycles.forEach {
            mApplication?.unregisterActivityLifecycleCallbacks(it)
        }
        mAppLifeCycles.forEach {
            if (mApplication != null) {
                it.onTerminate(mApplication!!)
            }
        }
    }

    private inner class FragmentLifecycleCallbacks : Application.ActivityLifecycleCallbacks {
        override fun onActivityCreated(activity: Activity, p1: Bundle?) {
            if (activity is FragmentActivity) {
                mFragmentLifeCycles.forEach {
                    activity.supportFragmentManager
                            .registerFragmentLifecycleCallbacks(it, true)
                }
            }
        }

        override fun onActivityStarted(p0: Activity) {
        }

        override fun onActivityResumed(p0: Activity) {
        }

        override fun onActivityPaused(p0: Activity) {
        }

        override fun onActivityStopped(p0: Activity) {
        }

        override fun onActivitySaveInstanceState(p0: Activity, p1: Bundle) {
        }

        override fun onActivityDestroyed(p0: Activity) {
        }

    }

    init {
        mModules = ManifestParser(context).parse()
        mModules?.forEach {
            it.injectAppLifecycle(context, mAppLifeCycles)
            it.injectActivityLifecycle(context, mActivityLifeCycles)
            it.injectFragmentLifecycle(context, mFragmentLifeCycles)
        }
    }
}