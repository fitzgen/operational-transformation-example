# Operational Transformation Example

This is an implementation of a real time collaborative document editor which
uses my [Operational Transformation library][ot-lib].

[ot-lib]: https://github.com/fitzgen/operational-transformation

Works with Node 0.4.X.

## Installing and Running

    $ git clone https://github.com/fitzgen/operational-transformation-example.git
    $ cd operational-transformation-example/
    $ ./util/setup.sh
    $ cd src/
    $ node r.js server.js
    25 Apr 21:56:13 - Your node instance does not have root privileges. This means that the flash XML policy file will be served inline instead of on port 843. This will slow down initial connections slightly.
    25 Apr 21:56:13 - socket.io ready - accepting connections
    Listening on port 8080

Now just open a couple tabs in your browser and point them to
http://127.0.0.1:8080/ and you can create and collaboratively edit a plain text
document between the tabs. *(At the time of this writing, April 25th 2011, you
have to use firebug or some other web inspector to find out what the document ID
is so that your second tab can join the first's session).*

## Utility Scripts

 * `./util/setup.sh`

   Run this to set up a fresh dev environment after you have cloned this
   repository. Pulls down dependencies, runs the RequireJS converter script on
   third party modules, etc.

 * `./util/clean.sh`

   Reset the environment as if it were a fresh clone of the repo. Will need to
   call `./util/setup.sh` once more to start developing again.

 * `./util/build.sh`

   Will eventually create optimized builds of the client javascript. I haven't
   gotten around to this yet though; it has been a low priority.
