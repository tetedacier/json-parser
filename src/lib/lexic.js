
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

const RAW_NUMBER = "(?:\\d+)"

const WHITE_SPACE = "(?:\\s|\\n)*"
const ESCAPE_STRING_SEQUENCE = `(?:\\\\{2})*\\\\(?:${
    SIMPLE_ESCAPE
}|${
    OCTAL_ESCAPE
}|${
    LATIN_ESCAPE
}|${
    UNICODE_ESCAPE
})`
const REGULAR_STRING_SEQUENCE = "[^\"'\\n\\\\]*"
const NUMBER_SEQUENCE =
    "((?:" +
        "0\\." + RAW_NUMBER + "|" +
        "[1-9](?:" + RAW_NUMBER + ")?\\." + RAW_NUMBER + "|" +
        RAW_NUMBER +
    ")" +
    "(?:e-?" + RAW_NUMBER +")?)"

module.exports = {
  DICTIONARY,
  SIMPLE_ESCAPE,
  OCTAL_ESCAPE,
  LATIN_ESCAPE,
  UNICODE_ESCAPE,
  RAW_ESCAPE,
  RAW_NUMBER,
  WHITE_SPACE,
  ESCAPE_STRING_SEQUENCE,
  REGULAR_STRING_SEQUENCE,
  NUMBER_SEQUENCE,
}
