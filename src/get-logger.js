import arrify from 'arrify'
import console from 'console'
import isPlainObject from 'lodash.isplainobject'

const shouldLog = {
  error: getShouldLogFn('error'),
  warn: getShouldLogFn('warn', 'error'),
  info: getShouldLogFn('info', 'warn', 'error'),
}

export default getLogger

function getLogger(logLevel) {
  return {
    error: getLogFn('error'),
    warn: getLogFn('warn'),
    info: getLogFn('info'),
  }

  function getLogFn(name) {
    return function logFn() {
      if (shouldLog[name](logLevel || process.env.LOG_LEVEL)) {
        const message = getMessage(...arguments)
        console[name](...message) // eslint-disable-line no-console
      }
    }
  }
}

function getMessage(first, ...rest) {
  if (isPlainObject(first) && first.message && first.ref) {
    return [...arrify(first.message), getLink(first.ref), ...rest]
  } else {
    return [first, ...rest]
  }
}

function getLink(ref) {
  const {version} = require('../package.json')
  return `https://github.com/kentcdodds/p-s/blob/v${version}/other/ERRORS_AND_WARNINGS.md#${ref}`
}

function getShouldLogFn(...acceptableValues) {
  acceptableValues = ['', 'debug', ...acceptableValues]
  return function shouldLogWithLevel(logLevel = '') {
    logLevel = logLevel.toLowerCase()
    return !logLevel || acceptableValues.some(v => logLevel === v)
  }
}
