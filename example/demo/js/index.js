/**
 * Created by huangjianhua on 2016/10/24.
 */


var indexView = {
    init: function() {

    },
    events: {
        'click .js_tolist': function() {
            indexView.toListAction();
        }
    },
    toListAction: function() {

        console.log('tolist');
        DF.goTo('/list.html', {
            targetModel: 1
        })
    },
    onCreate: function() {
        console.log('index onCreate ');
    },
    onShow: function() {
        console.log('index onShow ');
    },
    onHide: function() {
        console.log('index onHide ');
    }

}

exports.view = indexView;