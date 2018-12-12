const logError = (message, copy) => `${message}\n"${copy}" remaining`

const {
  GRAMMAR,
  TOKEN,
} = require('./grammar')
const compoundReviver = (type) => (reviver['revive' + `${
  type.substr(0, 1)
  }${
  type.toLocaleLowerCase().substr(1)
}`])
const guess = require('./guess')(GRAMMAR, TOKEN, compoundReviver, logError)

const { 
  reviveNull,
  reviveBoolean,
  reviveNumber,
  reviveArray,
  reviveObject,
  reviveString
} = require('./revive/index')

const reviver = {
  reviveNull,
  reviveBoolean,
  reviveNumber,
  reviveString,
  reviveArray: reviveArray(TOKEN, guess, logError, GRAMMAR),
  reviveObject: reviveObject(TOKEN, guess, logError, GRAMMAR),
}



module.exports = reviver
