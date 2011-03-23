require({
  baseUrl: 'js/',

  // set the paths to our library packages
  packages: [
    {
      name: 'dojo',
      location: 'dojo-release-1.6.0-src/dojo',
      main: 'lib/main-browser',
      lib: '.'
    },
    {
      name: 'dijit',
      location: 'dojo-release-1.6.0-src/dijit',
      main: 'lib/main',
      lib: '.'
    },
    {
      name: 'dojox',
      location: 'dojo-release-1.6.0-src/dojox',
      main: 'main.js',
      lib: '.'
    }
  ]
}, ['app/base']);