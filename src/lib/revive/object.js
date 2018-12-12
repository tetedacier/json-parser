/**
 * @method reviveObject
 * @description Inspects string for properties and ending of the current object
 * @param {string} study String which will be inspected for oblect properties and termination
 */
const reviveObject = (TOKEN, guess, logError) => (study) => {
  let objectItem = {}
  let done = false
  let copy = study

  while (done === false) {
    let key = copy.match(TOKEN.STRING_PATTERN_VALUE)
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
