#!/bin/bash

set -e

PWD=$(pwd)
UTILDIR="$PWD/$(dirname $0)"
ROOT=${UTILDIR/\/util/}

OUTDIR="$ROOT/src/www/js"
VERSION="1.6.0"
RJSVERSION="0.23.0"

DOJODIR="dojo-release-${VERSION}-src"
REQUIREJSDIR="requirejs-${RJSVERSION}"

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

if [ ! -d "$OUTDIR/operational-transformation" ]; then
    echo "Retrieving operational-transformation"
    $GET https://github.com/fitzgen/operational-transformation/tarball/master \
        | tar -C "$OUTDIR" -xz
    mv "$OUTDIR/fitzgen"* "$OUTDIR/operational-transformation"
fi

if [ ! -d "$OUTDIR/$DOJODIR" ]; then
	echo "Retrieving Dojo $VERSION"
	$GET http://download.dojotoolkit.org/release-$VERSION/$DOJODIR.tar.gz | tar -C "$OUTDIR" -xz
	echo "Dojo extracted to $OUTDIR/$DOJODIR"

    echo "Shimming dojox for AMD"
    ln -s "$OUTDIR/dojox-main-shim.js" "$OUTDIR/$DOJODIR/dojox/main.js"
fi

if [ ! -d "$OUTDIR/$REQUIREJSDIR" ]; then
	echo "Retrieving RequireJS $RJSVERSION"
	$GET http://requirejs.org/docs/release/$RJSVERSION/requirejs-$RJSVERSION.zip > \
		"$OUTDIR/requirejs-$RJSVERSION.zip" && \
	unzip "$OUTDIR/requirejs-$RJSVERSION.zip" -d "$OUTDIR" > /dev/null
	rm "$OUTDIR/requirejs-$RJSVERSION.zip"
	echo "RequireJS extracted to $OUTDIR/$REQUIREJSDIR"
fi

echo "Done!"
