const reviveString = require('./string')
const reviveNumber = require('./number')
const reviveBoolean = require('./boolean')
const reviveNull = require('./null')
const factory = {
  reviveString,
  reviveNumber,
  reviveBoolean,
  reviveNull,
}
const fieldNameCompiler = function (scheme,TOKEN) {
  return Object.keys(scheme.types).map(type => {
    const { fields } = scheme.types[type]
    console.log(type)
    return Object.keys(fields).map(key => {
      console.log(key, fields[key])
      // Base Type compiler
      let baseType = Object.assign(
        { name: key },
        [
          'string',
          'number',
          'boolean',
          'null'
        ].includes(fields[key]) ? {
            factory: fields[key].substr(0, 1).toUpperCase() + fields[key].substr(1).toLowerCase(),
            // factory: `${fields[key]}`,
            value: factory[`revive${fields[key].substr(0, 1).toUpperCase()}${fields[key].substr(1).toLowerCase()}`]
          } : {}
      )

      // Object type compiler
      baseType = Object.assign(
        baseType,
        [
          'object'
        ].includes(fields[key]) ? {
            factory: `OBJECT`,
            // factory: `${fields[key]}`,
            // value: factory[`revive${fields[key].substr(0, 1).toUpperCase()}${fields[key].substr(1).toLowerCase()}`]
          } : {}
      )

      // Array type compiler
      baseType = Object.assign(
        baseType,
        (Array.isArray(fields[key])) ? {
          // factory: `${fields[key].substr(0, 1).toUpperCase()}${fields[key].substr(1).toLowerCase()}`,
          allowedPrimitive: fields[key],
          // factory: `${fields[key]}`,
          // value: factory[`revive${fields[key].substr(0, 1).toUpperCase()}${fields[key].substr(1).toLowerCase()}`]
        } : {}
      )
      let currentCollection
      let isCollection = (collection) => (typeof collection === 'string') ? (
        (matchedCollection) => {
          if (matchedCollection) {
            currentCollection = matchedCollection[1]
            return true
          }
          return false
        }
      )(collection.match(/^collections#(.*)$/)) : false
      // Schema type compiler
      let types
      let isType = (type) => (typeof type === 'string') ? (
        (matchedType) => {
          if (matchedType) {
            types = matchedType[1]
            return true
          }
          return false
        }
      )(type.match(/^types#(.*)$/)) : false
      baseType = Object.assign(
        baseType,
        (isType(fields[key])) ? {
          // factory: `${fields[key].substr(0, 1).toUpperCase()}${fields[key].substr(1).toLowerCase()}`,
          typeName: types,
          // factory: `${fields[key]}`,
          // value: factory[`revive${fields[key].substr(0, 1).toUpperCase()}${fields[key].substr(1).toLowerCase()}`]
        } : {}
      )
      baseType = Object.assign(
        baseType,
        (isType(fields[key])) ? {
          // factory: `${fields[key].substr(0, 1).toUpperCase()}${fields[key].substr(1).toLowerCase()}`,
          typeName: types,
          // factory: `${fields[key]}`,
          // value: factory[`revive${fields[key].substr(0, 1).toUpperCase()}${fields[key].substr(1).toLowerCase()}`]
        } : {}
      )

      return baseType
    })
  })
}

/**
 * @method reviveObject
 * @description Inspects string for properties and ending of the current object
 * @param {string} study String which will be inspected for oblect properties and termination
 */
const reviveObject = (TOKEN, guess, logError, GRAMMAR) => (study, scheme) => {
  let objectItem = {}
  let done = false
  let copy = study
  let instance = scheme
  if (scheme) {
    console.log(`searching for ${JSON.stringify(scheme)} in copy ${copy}`)
    console.log(scheme)
    console.log('112', fieldNameCompiler(scheme))
  }
  while (done === false) {
    let key
    if (instance) {
      //
    }
    // } else {
      key = copy.match(TOKEN.STRING_PATTERN_VALUE)
    // }
    if (key) {
      copy = copy.substr(key[0].length)
      let assign = copy.match(TOKEN.FIELD_SEPARATOR)
      if (assign) {
        copy = copy.substr(assign[0].length)
        let iteration = guess(copy, 'CLOSE_OBJECT', (value) => {
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
      let emptyObjectTerminator = copy.match(TOKEN.CLOSE_OBJECT)
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

module.exports = { reviveObject }
