#!/bin/bash

set -e

PWD=$(pwd)
UTILDIR="$PWD/$(dirname $0)"
ROOT=${UTILDIR/\/util/}
OUTDIR="$ROOT/src/www/js"
VENDORDIR="$ROOT/src/vendor"

VERSION="1.6.0"
RJSVERSION="0.24.0"

DOJODIR="dojo-release-${VERSION}-src"
REQUIREJSDIR="requirejs-${RJSVERSION}"

rm -rf "$OUTDIR/$DOJODIR"
rm -rf "$OUTDIR/require"
rm -rf "$VENDORDIR/requirejs-build"
rm "$ROOT/src/r.js"
