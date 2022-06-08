// 过滤特殊字符
export function specialChar(value: string) {
    const regexp = /[`~!@#$^&*()=|{}':;',\[\].<>\/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/;
    return regexp.test(value);
}

// 身份证验证 方法
export function isIDCardFun(value: string) {
    const isIDCard1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    return isIDCard1.test(value);
}
