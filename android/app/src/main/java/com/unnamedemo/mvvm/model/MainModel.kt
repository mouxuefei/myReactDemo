package com.unnamedemo.mvvm.model

import com.mou.basemvvm.mvvm.BaseModel
import com.unnamedemo.http.HomeApiManager

/**
 * @FileName: MainModel.java
 * @author: villa_mou
 * @date: 08-10:49
 * @version V1.0 <描述当前版本功能>
 * @desc
 */
class MainModel:BaseModel() {
    fun  getArticle()= HomeApiManager.apiService.getArticle()
}