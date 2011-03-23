#!/bin/bash

set -e

PWD=$(pwd)
UTILDIR="$PWD/$(dirname $0)"
ROOT=${UTILDIR/\/util/}

OUTDIR="$ROOT/src/www/js"
VENDORDIR="$ROOT/src/vendor"
VERSION="1.6.0"

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

if [ ! -d "$OUTDIR/$DOJODIR" ]; then
	echo "Retrieving Dojo $VERSION"
	$GET http://download.dojotoolkit.org/release-$VERSION/$DOJODIR.tar.gz | tar -C "$OUTDIR" -xz
	echo "Dojo extracted to $OUTDIR/$DOJODIR"

    echo "Shimming dojox for AMD"
    ln -s "$OUTDIR/dojox-main-shim.js" "$OUTDIR/$DOJODIR/dojox/main.js"
fi

;; TODO: setup requirejs

echo "Done!"
