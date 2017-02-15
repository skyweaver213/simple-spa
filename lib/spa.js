/**
 * Created by huangjianhua on 2016/10/24.
 */

window.DEFAULTCONFIG = {}

//init pop
//var popped = ('state' in window.history && window.history.state !== null), initialURL = location.href;

function cloneObj(obj) {
    var o, obj;
    if (obj.constructor == Object) {
        o = new obj.constructor();
    } else {
        o = new obj.constructor(obj.valueOf());
    }
    for (var key in obj) {
        if (o[key] != obj[key]) {
            if (typeof(obj[key]) == 'object') {
                o[key] = cloneObj(obj[key]);
            } else {
                o[key] = obj[key];
            }
        }
    }
    o.toString = obj.toString;
    o.valueOf = obj.valueOf;
    return o;
}

var hostPathArr;
hostPathArr = location.pathname.split('/'); hostPathArr.pop();
var FHYBRID = {
    appPath: hostPathArr.join('/')
}


window.DF = {
    //所有view的引用都保存下来了
    VIEWREF: {},
    //当前view
    curView: '',
    //上一个view
    preView: '',

    //取url上的viewPath
    getViewPath: function (url) {
        return url.replace(location.protocol + '//' + location.host, '').replace(/\?.*/, '')
    },

    //初始函数
    init: function () {

        //viewport 写进 path-url
        $('.viewport').attr('page-path', location.href.replace(location.protocol + '//' + location.host, '').replace(/\?.*/, ''));

        //加载默认view
        var pat = new RegExp(FHYBRID.appPath, 'i');
        this.loadView(location.pathname.replace(pat, ''), false, true);

        $(window).bind("popstate.pageview", function (e) {

            //是单页spa操作  才触发
            if (this.getViewPath(location.href) != this.curView.htmlPath) {
                /*
                 * 该干嘛干嘛
                 */
                var pat = new RegExp(FHYBRID.appPath, 'i');
                DF.loadView(location.pathname.replace(pat, ''), false, false, true);
            }

        }.bind(this));
    },

    //动画执行方法
    /**
     * @param animInitClass  动画初始化时候的class
     * @param animBeforeClass  动画执行前的class
     * @param animEndClass  动画执行后的class
     */
    viewAnimation: function (opt) {
        var $static_el = opt.staticView;
        var $anim_el = opt.animView;
        var $anim_init_class = opt.animInitClass;
        var $anim_before_class = opt.animBeforeClass;
        var $anim_end_rmclass = opt.animEndClass;
        var anim_type = opt.animType || 'in';  //动画是进入 还是  出  ;  in  or out

        $anim_el.addClass($anim_init_class);

        //进入 动画节点 显示， 出， 对上一个页面显示
        (anim_type == 'in') ? $anim_el.show() : $static_el.show();


        setTimeout(function () {
            $anim_el.addClass($anim_before_class);

            $anim_el.on('webkitTransitionEnd', function () {
                //进入 对上一个页面隐藏；  出 动画节点 隐藏，
                (anim_type == 'in') ? $static_el.hide() : $anim_el.hide();

                $anim_el.removeClass($anim_end_rmclass);
                $anim_el.off('webkitTransitionEnd');
            });
        }, 0);


    },


    //获取页面所有script, return一个数组
    getViewPortScript: function (dom) {
        //debugger;
        return dom && dom.find('[type="text/fscript"]');
    },

    //获取viewport 节点
    getViewPort: function (text) {
        return text && $(text).find('.viewport');
    },

    //fishLoad
    fishLoad: function (htmlPath, pushState, search) {
        //记录上一个页面
        if (this.curView) {
            this.preView = this.curView;
        } else {
            this.preView = DF.VIEWREF[htmlPath];
        }

        search = search || '';

        //设置当前view
        this.curView = DF.VIEWREF[htmlPath];

        //console.log('curview ', this.curView.htmlPath, ' preView ', this.preView.htmlPath)

        //渲染成功
        if (pushState) {
            history.pushState({
                'viewPath': htmlPath,
                'pro': 'spa',
                'url': htmlPath
            }, "页面标题", htmlPath + search);
        }

    },

    /**
     * 更新pageid
     */
    updatePageid: function (view) {
        if (!view) return;
        var env = /ctrip/i.test(navigator.userAgent) ? 'hpageid' : 'pageid';
        var pid = view.viewPort.data(env);
        var p = document.querySelector('#page_id');
        if (!pid || !p) return;
        p.value = pid;
    },

    //动态引入view 参数： view的路径, 是否添加浏览器记录 , 是否第一个页面
    //@param1   view的路径
    //@param2   是否pushState
    //@param3   是否第一个加载页面
    //@param4   是否popstate里执行
    loadView: function (viewPath, pushState, firstLoad, popFlag) {  //
        //默认值是true
        if(typeof pushState == 'undefine') { pushState = true;}

        //去掉viewPath问号的内容
        var qpat = /\?.*/;
        var search = qpat.exec(viewPath);
        var pat = new RegExp(FHYBRID.appPath, 'i');
        var htmlPath = pat.test(viewPath) ? viewPath.replace(search, '') : (FHYBRID.appPath + viewPath.replace(qpat, ''));

        //判断节点是否已经生成
        var $viewPort = $("[page-path='" + htmlPath + "']");

        //所有viewport
        var $viewports = $('.viewport');
        //!firstLoad && $viewports.hide();

        if (($viewPort.length > 0) && !firstLoad) {
            //加载页面完成后
            this.fishLoad(htmlPath, pushState, search);

            if (!pushState) {

                //切换动画
                this.viewAnimation({
                    staticView: this.curView.viewPort,
                    animView: this.preView.viewPort,
                    animType: 'out',
                    animInitClass: 'ui-page-center ui-transition',
                    animBeforeClass: 'ui-page-right-i',
                    animEndClass: 'ui-page-right-i ui-transition ui-page-center'
                });


            } else {
                //回退动画
                if (popFlag) {

                    //切换动画
                    this.viewAnimation({
                        staticView: this.curView.viewPort,
                        animView: this.preView.viewPort,
                        animType: 'out',
                        animInitClass: 'ui-page-right ui-transition',
                        animBeforeClass: '',
                        animEndClass: 'ui-page-right ui-transition ui-page-center-i'
                    });


                } else {

                    //切换动画
                    this.viewAnimation({
                        staticView: this.preView.viewPort,
                        animView: this.curView.viewPort,
                        animType: 'in',
                        animInitClass: 'ui-page-right ui-transition',
                        animBeforeClass: 'ui-page-center-i',
                        animEndClass: 'ui-page-right ui-transition ui-page-center-i'
                    });


                }

            }


            //如果上一个view存在
            this.preView && this.preView.onHide && this.preView.onHide();
            this.curView.onShow();
            if (this.curView.onAppear) {
                DF.onAppear = this.curView.onAppear;
            }

            this.updatePageid(this.curView);

        } else {

            //获取script便签， 执行view的 oncreate , onshow 方法
            function getScript(data, scope) {

                var viewPort = DF.getViewPort(data);
                var scripts = DF.getViewPortScript(viewPort);

                //标记页面是否已经生成
                if (!firstLoad) {
                    viewPort.attr('page-path', htmlPath);

                    //判断动画方向
                    if (popFlag == true) {

                        //添加动画class
                        $('.main-viewport').append(viewPort);


                        //切换动画
                        scope.viewAnimation({
                            staticView: viewPort,
                            animView: scope.curView.viewPort,
                            animType: 'out',
                            animInitClass: 'ui-page-right ui-transition',
                            animBeforeClass: '',
                            animEndClass: 'ui-page-right ui-transition ui-page-center-i'
                        });


                    } else {
                        $('.main-viewport').append(viewPort);

                        //切换动画
                        scope.viewAnimation({
                            staticView: scope.curView.viewPort,
                            animView: viewPort,
                            animType: 'in',
                            animInitClass: 'ui-page-right ui-transition',
                            animBeforeClass: 'ui-page-center-i',
                            animEndClass: 'ui-page-right ui-transition ui-page-center-i'
                        });


                    }


                }


                //取scripts的绝对路径 如果不是绝对路径 ，需要动态计算
                var script_path = scripts[0].getAttribute('data-src') || '';

                require([script_path], function (exports) {

                    var view = cloneObj(exports.view);

                    view.htmlPath = htmlPath;
                    view.viewPort = $("[page-path='" + htmlPath + "']");
                    view.$ = function (selector) {
                        return view.viewPort.find(selector);
                    };
                    //每创建一个view 把引用存起来
                    DF.VIEWREF[htmlPath] = view;

                    //如果上一个view存在
                    scope.preView && scope.preView.onHide.apply(scope.preView);

                    //加载页面完成后
                    scope.fishLoad(htmlPath, pushState, search);


                    view && view.onCreate.apply(view);
                    //绑定事件
                    if (view && view.events) {
                        DF.bindEventAction.call(view, view.events);
                    }


                    view && view.onShow.apply(view);
                    if (view.onAppear) {
                        DF.onAppear = view.onAppear;
                    }
                    scope.updatePageid(view);


                });

            }

            if (firstLoad) {
                getScript(document, this);
            } else {
                var me = this;
                //获取html
                $.ajax({
                    url: htmlPath,
                    type: 'get',
                    success: function (data) {
                        //console.log('ss data ', data);
                        getScript(data, me);
                    },
                    error: function (e) {
                        console.log('error ', e);
                    }

                });

            }


        }


    },
    //绑定事件
    bindEventAction: function (events) {
        var view = this;
        Object.keys(events).forEach(function (key) {
            var expr = /(\w+)(\s+)([\S\s]+)/.exec(key);
            //符合才绑定
            if (expr) {
                //if(key.indexOf('js_price_detail') > -1) debugger;
                var ev = events[key];
                view.viewPort.on(expr[1], expr[3], ev);
            }

        })
    },
    //加载页面
    goTo: function (viewPath, opt) {
        typeof opt == undefined ? opt = {} : opt = opt;

        //打开方式, 1单页， 2 location.href
        if (opt.targetModel) {
            switch (opt.targetModel) {
                case 1:
                    break;
                case 2:
                    if (viewPath.indexOf('http://') > -1) {
                        window.location.href = viewPath;
                    } else {
                        window.location.href = viewPath;
                        //window.location.href = DF.baseUrl + viewPath;
                    }
                    break;
                default:
                    break;
            }
        }

        //设置title
        // if(opt.title) {
        //     DF.setTitle(opt.title);
        // }
        //show loading
        if (opt.showLoading) {
            DF.showLoading();
        }

        DF.loadView(viewPath, true, false, opt.back);
    },

    jump: function (url, opt) {
        typeof opt == undefined ? opt = {} : opt = opt;


        window.location.href = url;

    },


    setTitle: function () {

    },


    back: function () {
        history.back();
    },

    showLoading: function () {
        DF.Loading = DF.Loading || new Loading();
        DF.Loading.show();
    },

    hideLoading: function () {
        DF.Loading && DF.Loading.hide();
    }

}

//visi change
document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
        DF.onAppear && DF.onAppear();
    }
}, false);

$(function () {

    console.log('first loading ');

    var init_flag = $('.viewport').data('no-init');
    if (!init_flag) {
        DF.init();
    }


});


//暂时为了hack tpack的bug
exports.a = {a: 1};