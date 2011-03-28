/*jslint onevar: true, undef: true, eqeqeq: true, bitwise: true,
  newcap: true, immed: true, nomen: false, white: false, plusplus: false,
  laxbreak: true */

/*global define, io */

define([
    'dojo',
    '../socket.io.js'
], function (dojo) {
    return function (callback, errback) {
        console.log("Creating a new socket");
        var socket = new io.Socket();

        socket.on("connect", function connector () {
            console.log("Socket connected");
            callback({
                send: function (data) {
                    console.log("Sending " + dojo.toJson(data));
                    socket.send(dojo.toJson(data));
                },
                onMessage: function (fn) {
                    socket.on("message", function (data) {
                        if ( typeof data === "string" ) {
                            data = dojo.fromJson(data);
                        }
                        console.log("Received " + dojo.toJson(data));
                        fn(data);
                    });
                },
                onReconnect: function (fn) {
                    socket.on("reconnect", function () {
                        console.log("Reconnected");
                        fn();
                    });
                },
                onFailedReconnect: function (fn) {
                    socket.on("reconnect_failed", function () {
                        console.log("Failed to reconnect");
                        fn();
                    });
                },
                onDisconnect: function (fn) {
                    socket.on("disconnect", function () {
                        console.log("disconnected");
                        fn();
                    });
                }
            });
        });

        socket.on("connect_failed", function () {
            if ( errback ) {
                errback();
            }
        });

        socket.connect();
    };
});