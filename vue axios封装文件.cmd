import SITE from '@/js/config/siteConfig.js';
import axios from 'axios'
import qs from 'querystring';
export default {
    //获取ajaxHost
    getHost: function() {
        var host = location.host;
        var airUrl;
        airUrl = 'http://' + host;
        return airUrl
    },
    //请求方法
    // url: 请求地址
    // param: 入参
    // callback: 回调函数
    // flag: 请求方式
    // contentType: 入参类型
    // arrUrlParam: 请求参数放到url的时候的数组
    ajaxData: function(url, param, callBack, flag , contentType, arrUrlParam, host, collect) {
        var _this = this;
        var hostUrl, site;
        var methods;
        hostUrl = this.getHost();
        site = SITE.api[url] ? SITE.api[url] : url;
        methods = hostUrl + site;
        if(arrUrlParam){
            for(var i=0;i<arrUrlParam.length;i++){
                methods = methods + '/' +  arrUrlParam[i]
            }
        }
        axios.defaults.withCredentials = true;//axios 默认不发送cookie
        // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        axios.defaults.headers.common['token'] = sessionStorage.token;
        axios.defaults.headers.common['Accept-Language'] = localStorage.baseLang;
        if(flag == 'post'){
            axios.post(methods, contentType ? param : qs.stringify(param),{
                headers: {
                    'Content-Type': contentType ? contentType:'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                if (response.status === 200) {
                    if (callBack && typeof(callBack) === 'function') {
                        callBack(response.data);
                    }
                    //上报数据
                    if (collect) {
                        _this.getCollect(methods, response, collect, "success => " + data.success);
                    }
                }
            }).catch((error) => {
                if(error.response.status){
                    window.location.href = '/login';
                }
                //上报数据
                if (collect) {
                    _this.getCollect(methods, {}, collect, 'fail');
                }
            });
        }else{
            axios.get(methods, {
                params: param
            },{
                headers: {
                    'Content-Type': contentType ? contentType:'application/x-www-form-urlencoded'
                }
            }).then((response) => {
                if (response.status === 200) {
                    if (callBack && typeof(callBack) === 'function') {
                        callBack(response.data);
                    }
                    //上报数据
                    if (collect) {
                        _this.getCollect(methods, response, collect, "success => " + data.success);
                    }
                }
            }).catch((error) => {
                if(error.response.status){
                    window.location.href = '/login';
                    console.log(error)
                }
                console.log(error);
                //上报数据
                if (collect) {
                    _this.getCollect(methods, {}, collect, 'fail');
                }
            });
        }

    },
    //上传数据
    getCollect: function(methods, data, collect, status) {
        try {
            _TNC.upError({
                url: methods, ///string 接口名
                tel: collect.tel,
                status: status, //接口状态
                errCode: data.errorCode, ///string 错误码，有些code可能存在两个，如验舱验价
                msg: data.msg, //string 错误信息
                timing: new Date().getTime() - collect.times, //上报接口响应时间
                requestTime: collect.requestTime
            });
        } catch (e) {
            throw e;
        }
    }
};

