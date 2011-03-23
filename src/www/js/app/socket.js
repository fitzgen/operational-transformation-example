define([
    'dojo',
    'dojox',
    'dojox/socket'
], function (dojo, dojox, dojoSocket) {
    return function (url, callback) {
        var socket = dojoSocket.LongPoll(url);
        socket.on("open", function () {
            callback({
                send: function (data) {
                    socket.send(dojo.toJson(data));
                },
                receive: function (fn) {
                    socket.on("message", function (event) {
                        fn(dojo.fromJson(event.data));
                    });
                }
            });
        });
    };
});