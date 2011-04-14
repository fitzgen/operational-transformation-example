#!/bin/bash

set -e

PWD=$(pwd)
UTILDIR="$PWD/$(dirname $0)"
ROOT=${UTILDIR/\/util/}
OUTDIR="$ROOT/src/www/js"
VENDORDIR="$ROOT/src/node_modules"

VERSION="1.6.0"
RJSVERSION="0.24.0"

DOJODIR="dojo-release-${VERSION}-src"

if [ ! -d "$OUTDIR" ]; then
	echo "Output directory not found: $OUTDIR"
	exit 1
fi

if [ -x $(which wget) ]; then
	GET="wget --no-check-certificate -O -"
elif [ -x $(which curl) ]; then
	GET="curl -L --insecure -o -"
else
	echo "No cURL, no wget, no downloads :("
	exit 1
fi

echo "Pulling down and updating git submodules"
git submodule init
git submodule update

if [ ! -d "$OUTDIR/$DOJODIR" ]; then
	echo "Retrieving Dojo $VERSION"
	$GET http://download.dojotoolkit.org/release-$VERSION/$DOJODIR.tar.gz | tar -C "$OUTDIR" -xz
	echo "Dojo extracted to $OUTDIR/$DOJODIR"

    echo "Shimming dojox for AMD"
    ln -s "$OUTDIR/dojox-main-shim.js" "$OUTDIR/$DOJODIR/dojox/main.js"
fi

echo "Building requirejs (seems to require that node be version 0.4.X)"
if [ ! -d "$VENDORDIR/requirejs-build/requirejs-$RJSVERSION" ]; then
    cd "$VENDORDIR/requirejs/dist/"
    ./dist-build.sh "$RJSVERSION"
fi
cd "$ROOT/src"
if [ ! -L r.js ]; then
    ln -s "vendor/requirejs-build/$RJSVERSION/r.js" r.js
fi
cd "$OUTDIR"
rm -rf require/
mkdir -p require/
cd require/
ln -s "$VENDORDIR/requirejs-build/requirejs-$RJSVERSION/require.js" require.js
ln -s "$VENDORDIR/requirejs-build/requirejs-$RJSVERSION/i18n.js" i18n.js
ln -s "$VENDORDIR/requirejs-build/requirejs-$RJSVERSION/text.js" text.js
ln -s "$VENDORDIR/requirejs-build/requirejs-$RJSVERSION/order.js" order.js.js

echo "Running conversion script on submodules"
cd "$VENDORDIR/requirejs-build/requirejs-$RJSVERSION/build/convert/commonjs"
convert="../../../bin/x convert.js"
$convert "$VENDORDIR/socket.io" "$VENDORDIR/socket.io" &> /dev/null
$convert "$VENDORDIR/node-static" "$VENDORDIR/node-static" &> /dev/null

cd "$PWD"
echo "Done!"
