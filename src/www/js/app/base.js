/*jslint onevar: true, undef: true, eqeqeq: true, bitwise: true,
  newcap: true, immed: true, nomen: false, white: false, plusplus: false,
  laxbreak: true */

/*global define, prompt */

define([
    'operational-transformation/client',
    'app/socket',
    'dojo'
], function (OTClient, socket, dojo) {

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
                    update: function (text /* TODO: cursor position */) {
                        textarea.style.display = "block";
                        textarea.value = text;
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

});