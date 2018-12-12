/**
 * @method reviveArray
 * @description Inspects string for items and ending of the current array
 * @param {string} study String which will be inspected for array items and termination
 */
const reviveArray = function (TOKEN, guess) {
  return function (study) {
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
