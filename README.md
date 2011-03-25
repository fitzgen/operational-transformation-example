# Operational Transformation Example

This is an implementation of a real time collaborative document editor which
uses my Operational Transformation library.

I have only tested it with Node 0.4.3 and a fork of RequireJS 0.24.0 I have made
(which isn't in the repo yet). The changes I had to make to RequireJS for this
project are currently open pull requests and should be merged in within a week
or so (as of 3/24/11).

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
