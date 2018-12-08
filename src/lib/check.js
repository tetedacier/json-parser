const {JSONGrammar,JSONToken} = require('../JSON')
const { 
  get
} = require('underscore')
const logError = (message, copy) => `${message}\n"${copy}" remaining`

/**
 * @method guessValue
 * @description Determine type of current value, extract it and populate it. Also check for current sequence terminaison.
 * @param {String} study Remaining string to study
 * @param {String} terminator RawToken ending current object or array sequence
 * @param {Function} revivor Callback used populate the discovered value
 */
const guessValue = (study, terminator, revivor) => {
  let copy = study
  let done = false
  let types = Object.keys(JSONGrammar.TYPE)
  for (let i = 0, l = types.length; i < l; i++) {
    let match = copy.match(JSONGrammar.TYPE[types[i]].pattern)
    if (match) {
      copy = copy.substr(match[0].length)
      if (['ARRAY','OBJECT'].indexOf(types[i]) !== -1) {
        let method = checker['check' + ((type) => `${
          type.substr(0, 1)
        }${
          type.toLocaleLowerCase().substr(1)
        }`)(types[i])]
        const {
          value,
          remaining
        } = method(copy)

        copy = remaining
        revivor(value)
      } else {
        revivor(JSONGrammar.TYPE[types[i]].value(match))
      }

      let terminaison = ['ITEM_SEPARATOR', terminator].map(rule => Object.assign({
        key: rule,
        match: copy.match(JSONToken[rule])
      })).filter(capture => !!capture.match)
      
      if (terminaison.length === 1) {
        copy = copy.substr(terminaison[0].match[0].length)
        if (terminaison[0].key === terminator) {
          done = true
        }
        return {
          done,
          copy
        }
      } else {
        throw new SyntaxError(logError(
          `Every object value is either followed by comma or a object termination token`,
          copy
        ))
      }
    }
  }
}

/**
 * @method checkObject
 * @description Inspects string for properties and ending of the current object
 * @param {string} study String which will be inspected for oblect properties and termination
 */
const checkObject = (study) => {
  let objectItem = {}
  let done = false
  let copy = study

  while (done === false) {
    let key = copy.match(JSONToken.STRING_PATTERN_VALUE)
    if (key) {
      copy = copy.substr(key[0].length)
      let assign = copy.match(JSONToken.FIELD_SEPARATOR)
      if (assign) {
        copy = copy.substr(assign[0].length)
        let iteration = guessValue(copy, 'CLOSE_OBJECT', (value) => {
          objectItem[key[1]] = value
        })
        
        done = iteration.done
        copy = iteration.copy
      } else {
        throw new SyntaxError(logError(
          `missing field separator. object parsed at this step: ${objectItem}`, 
          copy
        ))
      }
    } else {
      let emptyObjectTerminator = copy.match(JSONToken.CLOSE_OBJECT)
      if (emptyObjectTerminator) {
        copy = copy.substr(emptyObjectTerminator[0].length)
        return { value: {}, remaining: copy }
      } else {
        throw new SyntaxError(logError(
          `neither key nor object terminator found at position ${
            copy.length
          } (from the end of string) in current context.`,
          copy
        ))
      }
    }
  }
  return {value: objectItem, remaining: copy}
}
/**
 * @method checkArray
 * @description Inspects string for items and ending of the current array
 * @param {string} study String which will be inspected for array items and termination 
 */
const checkArray = (study) => {
  let arrayItem = []
  let copy = study
  let defined = false

  let emptyArrayTerminator = copy.match(JSONToken.CLOSE_ARRAY)
  if (emptyArrayTerminator) {
    copy = copy.substr(emptyArrayTerminator[0].length)
    return { value: [], remaining: copy }
  } 
  while (defined === false) {
    const iteration = guessValue(copy, 'CLOSE_ARRAY', (value) => {
      arrayItem.push(value)
    })
    defined = iteration.done
    copy = iteration.copy
  }

  return { value: arrayItem, remaining: copy }
}

const checker = {
  checkObject,
  checkArray
}

module.exports = checker
