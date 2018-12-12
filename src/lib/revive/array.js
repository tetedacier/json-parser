
const collectionItemCompiler = (scheme) => {
  return Object.keys(scheme.collections).map(collectionName => {
    return 
  })
  // Collection type compiler
  let collection
  let baseType
  let values = scheme.collections

  baseType = Object.assign(
    baseType,
    (isCollection(fields[key])) ? {
      // factory: `${fields[key].substr(0, 1).toUpperCase()}${fields[key].substr(1).toLowerCase()}`,
      collectionName: collection,
      // factory: `${fields[key]}`,
      // value: factory[`revive${fields[key].substr(0, 1).toUpperCase()}${fields[key].substr(1).toLowerCase()}`]
    } : {}
  )
  return baseType
}

/**
 * @method reviveArray
 * @description Inspects string for items and ending of the current array
 * @param {string} study String which will be inspected for array items and termination
 */
const reviveArray = function (TOKEN, guess, logError, GRAMMAR) {
  return function (study, scheme) {
    if (scheme){
      console.log(`34${collectionItemCompiler(scheme)}`)
    }
    let arrayItem = []
    let copy = study
    let defined = false
    let emptyArrayTerminator = copy.match(TOKEN.CLOSE_ARRAY)
    if (emptyArrayTerminator) {
      copy = copy.substr(emptyArrayTerminator[0].length)
      return { value: [], remaining: copy }
    }
    while (defined === false) {
      const iteration = guess(copy, 'CLOSE_ARRAY', (value) => {
        arrayItem.push(value)
      })
      defined = iteration.done
      copy = iteration.copy
    }

    return { value: arrayItem, remaining: copy }
  }
} 

module.exports = { reviveArray }
