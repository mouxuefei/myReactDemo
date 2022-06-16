package com.unnamedemo.mvvm.view

import android.content.Intent
import androidx.lifecycle.Observer
import com.fortunes.commonsdk.base.BaseActivity
import com.fortunes.commonsdk.network.dealResult
import com.mou.basemvvm.helper.extens.bindDialogOrLifeCycle
import com.unnamedemo.mvvm.viewmodel.MainViewModel
import com.unnamedemo.R
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : BaseActivity<MainViewModel>() {
    override fun providerVMClass()= MainViewModel::class.java
    override fun getLayoutId() = R.layout.activity_main
    override fun initView() {
        btn.setOnClickListener {
            mViewModel.run {
                    this.getArticle()
                    .bindDialogOrLifeCycle(this@MainActivity)
                    .dealResult(this@MainActivity)
            }

        }
        btn_login.setOnClickListener {
            startActivity(Intent(this@MainActivity, RNPageActivity::class.java))
        }

        btn_mine.setOnClickListener {
        }
    }

    override fun initData() {
        mViewModel.chapterName.observe(this, Observer{
           it?.let { name.text=it }
        })
        mViewModel.link.observe(this, Observer{
            it?.let { desc.text=it }
        })
    }
}

