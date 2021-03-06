package com.fortunes.commonsdk.core

import android.app.Activity
import android.app.Application
import android.os.Build
import android.os.Bundle
import android.widget.RelativeLayout
import android.widget.TextView
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import com.fortunes.commonsdk.R
import com.gyf.barlibrary.ImmersionBar
import com.orhanobut.logger.Logger

/***
 * You may think you know what the following code does.
 * But you dont. Trust me.
 * Fiddle with it, and youll spend many a sleepless
 * night cursing the moment you thought youd be clever
 * enough to "optimize" the code below.
 * Now close this file and go play with something else.
 */
/***
 *
 *   █████▒█    ██  ▄████▄   ██ ▄█▀       ██████╗ ██╗   ██╗ ██████╗
 * ▓██   ▒ ██  ▓██▒▒██▀ ▀█   ██▄█▒        ██╔══██╗██║   ██║██╔════╝
 * ▒████ ░▓██  ▒██░▒▓█    ▄ ▓███▄░        ██████╔╝██║   ██║██║  ███╗
 * ░▓█▒  ░▓▓█  ░██░▒▓▓▄ ▄██▒▓██ █▄        ██╔══██╗██║   ██║██║   ██║
 * ░▒█░   ▒▒█████▓ ▒ ▓███▀ ░▒██▒ █▄       ██████╔╝╚██████╔╝╚██████╔╝
 *  ▒ ░   ░▒▓▒ ▒ ▒ ░ ░▒ ▒  ░▒ ▒▒ ▓▒       ╚═════╝  ╚═════╝  ╚═════╝
 *  ░     ░░▒░ ░ ░   ░  ▒   ░ ░▒ ▒░
 *  ░ ░    ░░░ ░ ░ ░        ░ ░░ ░
 *           ░     ░ ░      ░  ░
 *
 * Created by mou on 2018/9/11.
 */
@RequiresApi(Build.VERSION_CODES.ICE_CREAM_SANDWICH)
class ActivityLifecycleCallbacksImpl : Application.ActivityLifecycleCallbacks {
    override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) {
        Logger.i("${activity.javaClass.simpleName} onActivityCreated")
        ImmersionBar.with(activity)
                .statusBarDarkFont(true)
                .init()
        val toolbar: Toolbar? = activity.findViewById(R.id.toolbar)
        toolbar?.run {
            ImmersionBar.setTitleBar(activity, this)
            if (activity is AppCompatActivity) {
                activity.setSupportActionBar(activity.findViewById(R.id.toolbar))
                activity.supportActionBar?.setDisplayShowTitleEnabled(false)
            } else {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    activity.setActionBar(activity.findViewById(R.id.toolbar))
                    activity.actionBar?.setDisplayShowTitleEnabled(false)
                } else {

                }
            }
        }
        //设置title
        activity.findViewById<TextView>(R.id.toolbar_title)?.text = activity.title
        //设置左边点击事件
        activity.findViewById<RelativeLayout>(R.id.public_rl_back)?.setOnClickListener {
            activity.onBackPressed()
        }
    }

    override fun onActivityStarted(activity: Activity) {
    }

    override fun onActivityPaused(activity: Activity) {
    }

    override fun onActivityResumed(activity: Activity) {
    }


    override fun onActivityStopped(activity: Activity) {
    }

    override fun onActivitySaveInstanceState(p0: Activity, p1: Bundle) {

    }

    override fun onActivityDestroyed(activity: Activity) {
        ImmersionBar.with(activity).destroy()
    }
}