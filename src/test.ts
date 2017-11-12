const requires = require.context('mocha-loader!./', true, /Test\.ts$/)
requires.keys().forEach(requires)
