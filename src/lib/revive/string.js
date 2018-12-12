/**
 * @method reviveString
 * @description Return revived escape sequence of strings
 * @param {String[]} match
 */
 const {
   RAW_ESCAPE,
   DICTIONARY
 } = require('../lexic')

const reviveString = (match) => {
    let detectedEscapeSequence = new RegExp("\\\\" + RAW_ESCAPE, 'g')
    return match[1].replace(detectedEscapeSequence, (
        wholeString,
        simpleReplace,
        octalReplace,
        latinReplace,
        unicodeReplace
    ) => {
        if (simpleReplace) {
            return DICTIONARY[simpleReplace]
        }
        if (octalReplace) {
            return String.fromCodePoint(+('0o' + octalReplace))
        }
        if (latinReplace) {
            return String.fromCodePoint(+('0x' + latinReplace.substr(1)))
        }
        // generic unicode sequence
        return String.fromCodePoint(+('0x' + unicodeReplace.substr(1)))
    })
}

module.exports = {
  reviveString,
}
