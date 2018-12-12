
const {
  reviveString,
  reviveNumber,
  reviveBoolean,
  reviveNull,
} = require('./revive/index')
const { TOKEN } = require('./token')
const GRAMMAR = {
    DOCUMENT:[
        "ARRAY",
        "OBJECT"
    ],
    TYPE: {
        NULL: {
            pattern: TOKEN.NULL_PATTERN_VALUE,
            value: reviveNull
        },
        NUMBER: {
            pattern: TOKEN.NUMBER_PATTERN_VALUE,
            value: reviveNumber
        },
        STRING:{
            pattern: TOKEN.STRING_PATTERN_VALUE,
            value: reviveString
        },
        BOOLEAN: {
            pattern: TOKEN.BOOLEAN_PATTERN_VALUE,
            value: reviveBoolean
        },
        ARRAY: {
            pattern: TOKEN.OPEN_ARRAY
        },
        OBJECT: {
            pattern: TOKEN.OPEN_OBJECT
        }
    },
    OBJECT: [
        TOKEN.OPEN_OBJECT,
        TOKEN.CLOSE_OBJECT
    ],
    ARRAY: [
        TOKEN.OPEN_ARRAY,
        TOKEN.CLOSE_ARRAY
    ]
}

module.exports = {
  TOKEN,
  GRAMMAR,
}
