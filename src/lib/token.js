
const {
  WHITE_SPACE,
  REGULAR_STRING_SEQUENCE,
  ESCAPE_STRING_SEQUENCE,
  NUMBER_SEQUENCE,
} = require('./lexic')

const TOKEN = {
    OPEN_OBJECT: new RegExp(`^${
        WHITE_SPACE
        }\{${
        WHITE_SPACE
    }`),
    CLOSE_OBJECT: new RegExp(`^${
        WHITE_SPACE
        }\}${
        WHITE_SPACE
    }`),
    FIELD_SEPARATOR: new RegExp(`^${
        WHITE_SPACE
        }:${
        WHITE_SPACE
    }`),

    OPEN_ARRAY: new RegExp(`^${
        WHITE_SPACE
        }\\[${
        WHITE_SPACE
    }`),

    CLOSE_ARRAY: new RegExp(`^${
        WHITE_SPACE
        }\]${
        WHITE_SPACE
    }`),

    ITEM_SEPARATOR: new RegExp(`^${
        WHITE_SPACE
        },${
        WHITE_SPACE
    }`),

    BOOLEAN_PATTERN_VALUE: new RegExp(`^${
        WHITE_SPACE
        }(true|false)${
        WHITE_SPACE
    }`),

    /**
    * @see test/file-string.test
    */
    STRING_PATTERN_VALUE: new RegExp(`^${
        WHITE_SPACE
        }"((?:${
          REGULAR_STRING_SEQUENCE
        }${
          ESCAPE_STRING_SEQUENCE
        })*(?:${
          REGULAR_STRING_SEQUENCE
        })?)"${
        WHITE_SPACE
    }`),

    NULL_PATTERN_VALUE: new RegExp(`^${
        WHITE_SPACE
        }null${
        WHITE_SPACE
    }`),

    /**
    * @see test/file-number.test
    */
    NUMBER_PATTERN_VALUE: new RegExp(`^${
        WHITE_SPACE
    }${NUMBER_SEQUENCE}${
        WHITE_SPACE
    }`),
}
module.exports = {
    TOKEN,
}
