const requires = require.context('./', true, /Test\.ts$/)
requires.keys().forEach(requires)
