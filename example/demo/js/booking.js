/**
 * Created by huangjianhua on 2016/10/24.
 */
    
var bookingView = {
    init: function() {

    },
    events: {
        'click .js_back': function() {
            bookingView.toListAction();
        }
    },
    toListAction: function() {

        DF.back()
    },
    onCreate: function() {
        console.log('booking onCreate ');
    },
    onShow: function() {
        console.log('booking onShow ');
    },
    onHide: function() {
        console.log('booking onHide ');
    }

}

exports.view = bookingView;