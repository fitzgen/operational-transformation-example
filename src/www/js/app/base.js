/*jslint onevar: true, undef: true, eqeqeq: true, bitwise: true,
  newcap: true, immed: true, nomen: false, white: false, plusplus: false,
  laxbreak: true */

/*global define, prompt, window, history */

define([
    'operational-transformation/client',
    'operational-transformation/messages',
    'app/socket',
    'dojo'
], function (OTClient, messages, socket, dojo) {

    var newButton = dojo.create("button", {
            id: 'new-document',
            innerHTML: 'New Document'
        }, dojo.body()),

        joinButton = dojo.create("button", {
            id: 'join-document',
            innerHTML: 'Join Document'
        }, dojo.body()),

        textarea = dojo.create("textarea", {
            id: "document",
            style: {
                display: "none",
                width: "500px",
                height: "200px"
            }
        }, dojo.body());

    function hideButtons () {
        dojo.style(newButton, "display", "none");
        dojo.style(joinButton, "display", "none");
    }

    function attachToButton (btn, fn) {
        dojo.connect(btn, "onclick", function (event) {
            event.preventDefault();
            fn();
        });
        dojo.connect(btn, "onkeypress", function (event) {
            if ( event.keyCode === 13 ) {
                event.preventDefault();
                fn();
            }
        });
    }

    function init (id) {
        socket(function (connection) {
            OTClient.OTDocument({
                id: id,
                socket: connection,
                pubsub: dojo,
                ui: {
                    getDocument: function () {
                        return textarea.value;
                    },
                    getSelection: function () {
                        return {
                            start: textarea.selectionStart,
                            end: textarea.selectionEnd
                        };
                    },
                    update: function (text, selection) {
                        selection = selection || {};
                        textarea.style.display = "block";
                        textarea.value = text;
                        if ( selection.start ) {
                            textarea.selectionStart = selection.start;
                        }
                        if ( selection.end ) {
                            textarea.selectionEnd = selection.end;
                        }
                    }
                }
            });
        });
    }

    attachToButton(newButton, function () {
        hideButtons();
        init(null);
    });

    attachToButton(joinButton, function () {
        hideButtons();
        init(prompt("Document id:"));
    });

    if ( window.location.search && window.location.search !== "?" ) {
        hideButtons();
        init(window.location.search.replace("?", ""));
    }

    dojo.subscribe("/ot/connect", function (msg) {
        history.replaceState({},
                             "Document " + messages.id(msg),
                             "?" + messages.id(msg));
    });

    dojo.subscribe("/ot/error", function (reason) {
        // TODO: create a top level notificiation thing that can display this
        // stuff.
    });

});