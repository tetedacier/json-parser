const { reviveNull } = require('./null')
const { reviveBoolean } = require('./boolean')
const { reviveNumber } = require('./number')
const { reviveArray } = require('./array')
const { reviveObject } = require('./object')
const { reviveString } = require('./string')

module.exports = {
    reviveNull,
    reviveBoolean,
    reviveNumber,
    reviveArray,
    reviveObject,
    reviveString,
}
