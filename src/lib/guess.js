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
      let type = types[i];
      let match = copy.match(GRAMMAR.TYPE[type].pattern)
      if (match) {
        copy = copy.substr(match[0].length)
        if (GRAMMAR.DOCUMENT.includes(type)) {
          const {
            value,
            remaining
          } = compoundReviver(type)(copy)

          copy = remaining
          revive(value)
        } else {
          revive(GRAMMAR.TYPE[type].value(match))
        }

        let terminaison = [GRAMMAR.TOKEN.ITEM_SEPARATOR, terminator].map(rule => Object.assign({
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
