const path = require('path')
const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  rootDir: path.join(__dirname, '..'),
  verbose: true,
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverage: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
}
