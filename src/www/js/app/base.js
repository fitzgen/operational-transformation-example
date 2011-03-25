define([
    'operational-transformation/client',
    'app/socket'
], function (OTClient, socket) {

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
            disabled: true
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
                        return textarea.innerHTML;
                    },
                    getSelection: function () {
                        // TODO dijit.range.getSelection (in
                        // dijit/_editor/range.js). Need to move to dijit.Editor
                        // to use this though.
                    },
                    update: function (text /* TODO: cursor position */) {
                        dojo.removeAttr(textarea, "disabled");
                        textarea.innerHTML = text;
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