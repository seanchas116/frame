const requires = require.context('mocha-loader!../', true, /\.test\.ts$/)
requires.keys().forEach(requires)
