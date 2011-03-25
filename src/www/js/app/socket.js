define([
    'dojo',
    '../socket.io.js'
], function (dojo) {
    return function (callback) {
        var socket = new io.Socket();
        socket.on("connect", function () {
            callback(window.socket = {
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
        socket.connect();
    };
});