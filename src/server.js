/*jslint onevar: false, undef: true, eqeqeq: true, bitwise: true,
  newcap: true, immed: true, nomen: false, white: false, plusplus: false,
  laxbreak: true */

/*global require, process, console */

require({
    paths: {
        'operational-transformation': 'node_modules/operational-transformation'
    }
}, [
    'http',
    'operational-transformation/apply',
    'operational-transformation/ot',
    'operational-transformation/messages',
    'operational-transformation/stores/memory-store',
    'node-static',
    'socket.io'
], function (http, apply, ot, messages, memoryStore, nodeStatic, io) {


    // Serve the static files with node-static.


    var staticServer = new nodeStatic.Server("./www");
    var port = process.argv[3]
        ? Number(process.argv[3])
        : 8080;
    var server = http.createServer(function (request, response) {
        request.addListener('end', function () {
            staticServer.serve(request, response);
        });
    });
    server.listen(port, console.log.bind(console, "Listening on port " + port));


    // Handle communication between the network layer and the OT layer.


    // This object should have the following structure:
    //
    //     { <client id> : <client connection object> }
    var clients = {};

    // This object should have the following structure:
    //
    //     { <document id> : { <client id> : true } }
    var documents = {};

    // Send a message to a single client (by id). If message is not a string,
    // JSON.stringify it.
    function send (clientId, message) {
        if ( clientId in clients ) {
            message = typeof message === "string"
                ? message
                : JSON.stringify(message);
            clients[clientId].send(message);
        } else {
            throw new Error('No such client ' + clientId);
        }
    }

    // Broadcast a message to a every client which is editing the document whose
    // id is docId. If message is not a string, JSON.stringify it.
    function broadcast (docId, message) {
        if ( docId in documents ) {
            message = typeof message === "string"
                ? message
                : JSON.stringify(message);
            Object.keys(documents[docId]).forEach(function (clientId) {
                send(clientId, message);
            });
        } else {
            throw new Error('No such document ' + docId);
        }
    }

    // Register a new client in the above data structures when they begin
    // editing a document.
    function addClient (docId, clientId, client) {
        documents[docId] = documents[docId] || {};
        documents[docId][clientId] = true;
        clients[clientId] = client;
    }

    // Deregister a client and remove them from the above data structures.
    function removeClient (docId, clientId) {
        if ( documents[docId] ) {
            delete documents[docId][clientId];
            if ( Object.keys(documents[docId]).length === 0 ) {
                delete documents[docId];
            }
        }
        delete clients[clientId];
    }

    // Initialize the public API of our OT layer.
    var otManager = ot({
        store: memoryStore
    });

    otManager.on("update", function (msg) {
        console.log("Broadcasting to " + msg.id + ": " + JSON.stringify(msg));
        broadcast(messages.id(msg), {
            type: "update",
            data: msg
        });
    });

    otManager.on("error", function (e) {
        console.error("Error: " + e);
    });

    // Handle new socket connections (can be reconnects) and create a new
    // document for them if there is no existing doc id supplied.
    function handleConnect (clientId, client, data, callback) {
        var docId;
        if ( data.id ) {
            docId = data.id;
            addClient(docId, clientId, client);
            callback(docId);
        } else {
            otManager.newDocument(function (err, doc) {
                if ( err ) {
                    throw err;
                }
                docId = doc.id;
                addClient(docId, clientId, client);
                callback(docId);
            });
        }
    }

    function handleUpdate (data) {
        otManager.applyOperation(data);
    }

    // Start listening for new client connections, and when they connect, attach
    // all of our listeners, etc.
    io.listen(server).on('connection', function (client) {

        var docId,
            clientId = client.sessionId;

        client.on('message', function (event) {
            console.log("Message from " + clientId + ": " + event);
            event = JSON.parse(event);

            switch ( event.type ) {
            case 'connect':
                handleConnect(clientId, client, event.data, function (id) {
                    docId = id;
                    memoryStore.getDocument(id, function (err, doc) {
                        if ( err ) {
                            console.error("Error: " + err);
                            /* TODO: Send back response saying there is no such document */
                        }
                        var msg = {};
                        messages.id(msg, doc.id);
                        messages.revision(msg, doc.rev);
                        messages.document(msg, doc.doc);
                        client.send({
                            type: "connect",
                            data: msg
                        });
                    });
                });
                break;
            case 'update':
                handleUpdate(event.data);
                break;
            default:
                throw new Error('Unknown message message type: ' + event.type);
            }
        });

        client.on('disconnect', function () {
            removeClient(docId, clientId);
        });

    });

});
