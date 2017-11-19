const requires = require.context('./', true, /Test\.ts$/)
requires.keys().forEach(requires)

after(() => {
  const coverage = (window as any).__coverage__
  if (coverage) {
    console.log('Found coverage report, writing to coverage.json')
    const path = require('path')
    const fs = require('fs')
    fs.writeFileSync(path.resolve(process.cwd(), 'coverage.json'), JSON.stringify(coverage))
  }
})
