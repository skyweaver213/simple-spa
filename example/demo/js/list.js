/**
 * Created by huangjianhua on 2016/10/24.
 */

var listView = {
    init: function() {

    },
    events: {
        'click .js_tobooking': function() {
            listView.toBookingAction();
        },
        'click .js_back':function() {
            DF.back();
        }
    },
    toBookingAction: function() {

        console.log('booking');
        DF.goTo('/booking.html', {
            targetModel: 1
        })
    },
    onCreate: function() {
        console.log('list onCreate ');
    },
    onShow: function() {
        console.log('list onShow ');
    },
    onHide: function() {
        console.log('list onHide ');
    }

}

exports.view = listView;