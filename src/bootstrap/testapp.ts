import * as chai from 'chai'
chai.config.truncateThreshold = 0

const requires = require.context('mocha-loader!../', true, /\.test\.ts$/)
requires.keys().forEach(requires)
