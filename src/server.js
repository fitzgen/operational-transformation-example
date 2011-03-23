require([
    './vendor/operational-transformation/apply',
    './vendor/operational-transformaion/ot',
    'http',
    'url',
    'path',
    'fs'
], function (apply, ot, http, url, path, fs) {

    // This module implements a server which does 2 things:
    //
    // 1. Serves static files
    //
    // 2. Comet server which glues together the OT with communicating to the
    //    client.
    //
    // We need a simple static file server for all the js/css/etc. In
    // production, you would run this comet server behind apache/nginx and only
    // proxy requests coming to '/comet' to this server. The static file server
    // is definitely not robust. This is just an example app. Don't use this in
    // a real situation.

    // Static stuff

    function send404 (resp) {
        resp.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        resp.end("Not found.");
    }

    function send403 (resp) {
        resp.writeHead(403, {
            'Content-Type': 'text/plain'
        });
        resp.end("Forbidden");
    }

    function send500 (resp) {
        resp.writeHead(500, {
            'Content-Type': 'text/plain'
        });
        resp.end("Server error.");
    }

    function send200 (contentType, buffer, resp) {
        resp.writeHead(200, {
            'Content-Type': contentType
        });
        resp.write(buffer);
        resp.end();
    }

    function getContentType (pathname) {
        return {
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.html': 'text/html'
        }[path.extname(pathname)] || 'text/plain';
    }

    function serveStatic (publicRoot, pathname, resp) {
        if ( pathname.indexOf('..') >= 0 ) {
            send403(resp);
        } else {
            if ( pathname === '/' ) {
                pathname = '/index.html';
            }
            console.log(pathname);
            fs.readFile(path.join(publicRoot, pathname), function (error, buffer) {
                if ( error ) {
                    if ( error.errno === 2 ) {
                        send404(resp);
                    } else {
                        send500(resp);
                    }
                } else {
                    send200(getContentType(pathname), buffer, resp);
                }
            });
        }
    };

    // ## Comet stuff

    var docsToClients = {};

    // ot.on();

    function handleComet (data, response) {
        // if ( data === null ) {
        //     // pass?
        // } else if ( ! data.id ) {
        //     ot.newDocument(function (err, doc) {
        //         response.writeHead(200, {
        //         });
        //         response.end(JSON.stringify(doc));
        //         docsToClients[doc.id] = [];
        //     });
        // } else {
        // }
        console.log(data);
        response.end("ok");
    }

    var port = process.argv[3] ? Number(process.argv[3]) : 8080;

    http.createServer(function (request, response) {
        var dataBuffer = "";
        request.setEncoding('utf8');
        request.on('data', function (chunk) {
            dataBuffer += chunk;
        });
        request.on('end', function () {
            var path = url.parse(request.url).pathname;
            if ( path === "/comet" ) {
                response.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                handleComet(dataBuffer !== "" ? JSON.parse(dataBuffer) : null,
                            response);
            } else {
                serveStatic('www/', path, response);
            }
        });
    }).listen(port, null, console.log.bind(console, 'Listening on ' + port));

});