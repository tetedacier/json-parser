module.exports = function (GRAMMAR, TOKEN, compoundReviver, logError) {
  /**
   * @method guess
   * @description Determine type of current value, extract it and populate it. Also check for current sequence terminaison.
   * @param {String} study Remaining string to study
   * @param {String} terminator RawToken ending current object or array sequence
   * @param {Function} revivor Callback used populate the discovered value
   */
  return function (study, terminator, revive) {
    let copy = study
    let done = false
    let types = Object.keys(GRAMMAR.TYPE)
    for (let i = 0, l = types.length; i < l; i++) {
      let match = copy.match(GRAMMAR.TYPE[types[i]].pattern)
      if (match) {
        copy = copy.substr(match[0].length)
        if (['ARRAY', 'OBJECT'].indexOf(types[i]) !== -1) {
          const {
            value,
            remaining
          } = compoundReviver(types[i])(copy)

          copy = remaining
          revive(value)
        } else {
          revive(GRAMMAR.TYPE[types[i]].value(match))
        }

        let terminaison = ['ITEM_SEPARATOR', terminator].map(rule => Object.assign({
          key: rule,
          match: copy.match(TOKEN[rule])
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
} 
