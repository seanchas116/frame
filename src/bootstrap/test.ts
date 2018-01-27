import * as fs from 'fs'
import * as path from 'path'

// require all core modules to see coverage
const coreRequireContext = require.context('../core', true, /\.tsx?$/)
coreRequireContext.keys().forEach(coreRequireContext)

// require all tests
const testRequireContext = require.context('../', true, /\.test\.ts$/)
testRequireContext.keys().forEach(testRequireContext)

after(() => {
  const coverage = (window as any).__coverage__
  if (coverage) {
    console.log('Found coverage report, writing to coverage.json')
    fs.writeFileSync(path.resolve(process.cwd(), 'coverage.json'), JSON.stringify(coverage))
  }
})
