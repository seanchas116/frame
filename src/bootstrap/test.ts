import * as fs from 'fs'
import * as path from 'path'

const requires = require.context('../', true, /\.test\.ts$/)
requires.keys().forEach(requires)

after(() => {
  const coverage = (window as any).__coverage__
  if (coverage) {
    console.log('Found coverage report, writing to coverage.json')
    fs.writeFileSync(path.resolve(process.cwd(), 'coverage.json'), JSON.stringify(coverage))
  }
})
