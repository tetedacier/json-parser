const RAW_NUMBER = "(?:\\d+)"
/**
 * 
 */
const DICTIONARY = {
    "'": "\'",
    '"': "\"",
    'n': "\n",
    'r': "\r",
    'v': "\v",
    't': "\t",
    'b': "\b",
    'f': "\f"
}
const SIMPLE_ESCAPE = "[\'\"nrvtbf]"
const OCTAL_ESCAPE = "[0-7]{3}"
const LATIN_ESCAPE = "x[a-fA-F0-9]{2}"
const UNICODE_ESCAPE = "u[a-fA-F0-9]{1,6}"
const RAW_ESCAPE = `(?:(${
        SIMPLE_ESCAPE
    })|(${
        OCTAL_ESCAPE
    })|(${
        LATIN_ESCAPE
    })|(${
        UNICODE_ESCAPE
    }))`

const RawToken = {
    whiteSpace: "(?:\\s|\\n)*",
    escapeStringSequence: `(?:\\\\{2})*\\\\(?:${
        SIMPLE_ESCAPE
    }|${
        OCTAL_ESCAPE
    }|${
        LATIN_ESCAPE
    }|${
        UNICODE_ESCAPE
    })`,
    regularStringSequence: "[^\"'\\n\\\\]*",
    numberSequence:
        "((?:" +
            "0\\." + RAW_NUMBER + "|" +
            "[1-9](?:" + RAW_NUMBER + ")?\\." + RAW_NUMBER + "|" +
            RAW_NUMBER +
        ")" +
        "(?:e-?" + RAW_NUMBER +")?)"
}
/**
 * @method checkNull
 * @description Return a revived null value
 */
const checkNull = () => (null)

/**
 * @method checkNumber
 * @description Return revived number
 * @param {String[]} match 
 */
const checkNumber = (match) => (+match[1])
// const checkNumber = (match)=>(new Number(match[1]))

/**
 * @method checkBoolean
 * @description Return revived boolean
 * @param {String[]} match 
 */
const checkBoolean = (match) => ('true' === match[1])
/**
 * @method checkString
 * @description Return revived escape sequence of strings
 * @param {String[]} match 
 */
const checkString = (match) => {
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

const JSONToken = {
    OPEN_OBJECT: new RegExp(`^${
        RawToken.whiteSpace
        }\{${
        RawToken.whiteSpace
    }`),
    CLOSE_OBJECT: new RegExp(`^${
        RawToken.whiteSpace
        }\}${
        RawToken.whiteSpace
    }`),
    FIELD_SEPARATOR: new RegExp(`^${
        RawToken.whiteSpace
        }:${
        RawToken.whiteSpace
    }`),

    OPEN_ARRAY: new RegExp(`^${
        RawToken.whiteSpace
        }\\[${
        RawToken.whiteSpace
    }`),

    CLOSE_ARRAY: new RegExp(`^${
        RawToken.whiteSpace
        }\]${
        RawToken.whiteSpace
    }`),

    ITEM_SEPARATOR: new RegExp(`^${
        RawToken.whiteSpace
        },${
        RawToken.whiteSpace
    }`),

    BOOLEAN_PATTERN_VALUE: new RegExp(`^${
        RawToken.whiteSpace
        }(true|false)${
        RawToken.whiteSpace
    }`),

    /**
    * @see test/file-string.test
    */
    STRING_PATTERN_VALUE: new RegExp(`^${
        RawToken.whiteSpace
        }"((?:${
        RawToken.regularStringSequence
        }${
        RawToken.escapeStringSequence
        })*(?:${
        RawToken.regularStringSequence
        })?)"${
        RawToken.whiteSpace
    }`),

    NULL_PATTERN_VALUE: new RegExp(`^${
        RawToken.whiteSpace
        }null${
        RawToken.whiteSpace
    }`),

    UNDEFINED_PATTERN_VALUE: new RegExp(`^${
        RawToken.whiteSpace
        }undefined${
        RawToken.whiteSpace
    }`),
    /**
    * @see test/file-number.test
    */
    NUMBER_PATTERN_VALUE: new RegExp(`^${
        RawToken.whiteSpace
    }${RawToken.numberSequence}${
        RawToken.whiteSpace
    }`),
}

const JSONGrammar = {
    DOCUMENT:[
        "ARRAY",
        "OBJECT"
    ],
    TYPE: {
        NULL: {
            pattern: JSONToken.NULL_PATTERN_VALUE,
            value: checkNull
        },
        NUMBER: {
            pattern: JSONToken.NUMBER_PATTERN_VALUE,
            value: checkNumber
        },
        STRING:{
            pattern: JSONToken.STRING_PATTERN_VALUE,
            value: checkString
        },
        BOOLEAN: {
            pattern: JSONToken.BOOLEAN_PATTERN_VALUE,
            value: checkBoolean
        },
        ARRAY: {
            pattern: JSONToken.OPEN_ARRAY
        },
        OBJECT: {
            pattern: JSONToken.OPEN_OBJECT
        }
    },
    OBJECT: [
        JSONToken.OPEN_OBJECT,
        JSONToken.CLOSE_OBJECT
    ],
    ARRAY: [
        JSONToken.OPEN_ARRAY,
        JSONToken.CLOSE_ARRAY
    ]
}

module.exports = {
    JSONToken,
    JSONGrammar,
    checkString
}
