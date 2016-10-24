/**
 * Created by huangjianhua on 2016/10/18.
 */

//标记已经加载成功的个数
var REQ_TOTAL = 0;
//模块导出
window.exports = {};
//记录各个模块的顺序
var exp_arr = [];

//判断是否数组
function isArray(param) {
    return param instanceof Array;
}

//require 真正实现
function require(arr, callback) {

    var req_list;

    if(isArray(arr)) {
        req_list = arr;
    } else {
        req_list = [arr];
    }
    var req_len = req_list.length;

    //模块逐个加载
    for(var i=0;i<req_len;i++) {
        var req_item = req_list[i];

        var $script = createScript(req_item, i);

        var $node = document.querySelector('head');

        (function($script) {
            //检测script 的onload事件
            $script.onload = function() {
                REQ_TOTAL++;

                var script_index = $script.getAttribute('index');

                exp_arr[script_index] = exports;

                window.exports = {};

                //所有链接加载成功后，执行callback
                if(REQ_TOTAL == req_len) {
                    callback && callback.apply(exports, exp_arr);

                }

            }

            $node.appendChild($script);
        })($script);

    }

}

//创建一个script标签
function createScript(src, index) {
    var $script = document.createElement('script');

    $script.setAttribute('src', src);
    $script.setAttribute('index', index);

    return $script;
}