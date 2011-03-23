// AMD module id = dojox
//
// This is a package main module for the dojox package. The dojox package is
// somewhat unusual in that is it currently constructed to just provide an empty
// object.
//

// for now, we publish dojox into the global namespace because so many tests and
// apps expect it.
define(["dojo"], function(dojo) {
	// the current dojo bootstrap defines dijit; this may change and this module
    // provides a little future-proof with the disjunction.
	dojox = dojo._dojox || {};
	return dojox;
});
