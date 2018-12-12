/**
 * @method reviveBoolean
 * @description Return revived boolean
 * @param {String[]} match
 */
const reviveBoolean = (match) => ('true' === match[1])

module.exports = {
  reviveBoolean,
}
