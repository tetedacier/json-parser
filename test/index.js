require('colors')
var {assert, expect} = require('chai')
const fs = require('fs')
const { 
    JSONToken,
    JSONGrammar,
    checkString,
 } = require('../src/JSON')
const {
    checkObject,
    checkArray,
} = require('../src/lib')
const {
    keys
} = require('underscore')

const log = (expectation) => `with given expectation : \n${
    '  '.repeat(3)
}${
    JSON.stringify(expectation).bold.green
}`

;describe('string revivor'.cyan, function() {
    const stringReviver = {
        simple: ['\\251',"\251"],
        // octal seems to be banned from JSON parse
        octal: ['\\n',"\n"],
        latin: ['\\x20'," "],
        unicode: ['\\u20'," "],
        none: ['e','e']
    }

    describe('should revive the following string representation using escape sequences', function () {
        keys(stringReviver).forEach((i) => {
            it(`${'"'.blue}${stringReviver[i][0].bold.green}${'"'.blue} ${
                '()>'.green
            } ${
                stringReviver[i][1].bgWhite.black
            }`, function () {
                assert.equal(checkString([, stringReviver[i][0]]), stringReviver[i][1]);
            })
        })
    })
})

;describe('string validator'.cyan, function () {
    let samples = fs.readFileSync('./test/file-string.test').toString()
        .split(/\n/)
        .filter(line => line.match("^\s*$") === null)

    var expectation = JSON.parse('[' + samples.map(value => value.replace(/^[^"]+"(.*)"$/, '"$1"')).join(',') + ']')
    describe('should match the following string representation and preserve escape sequences', function () {
        samples.forEach((sample, iteration) => {
            it(`${'"'.blue}${sample.bold.green}${'"'.blue}`, function () {
                let match = sample.match(JSONToken.STRING_PATTERN_VALUE)
                assert.equal(checkString(match), expectation[iteration]);
            })
        })
    })
})


; describe('number validator'.cyan, function () {
    var samples = fs.readFileSync('./test/file-number.test').toString()
        .split(/\n/)
        .filter(line => line.match("^\s*$") === null)
    var expectation = JSON.parse(`[${samples.join(',')}]`)

    describe('should match the following string representation of number', function () {
        samples.forEach((sample, iteration) => {
            it(`${'"'.blue}${sample.bold.green}${'"'.blue}`, function () {
                let match = sample.match(JSONToken.NUMBER_PATTERN_VALUE)
                assert.equal(+match[1], expectation[iteration]);
            })
        })
    })
})


; describe('array validator'.cyan, function () {
    var sample = fs.readFileSync('./test/file-array.test').toString()
    var expectation = JSON.parse(sample)
    describe(log(expectation), () => {
        it('should parse the same array as JSON.parse without reviver',()=>{
            let arrayStart = sample.match(JSONGrammar.ARRAY[0])
            if (arrayStart) {
                let extractedArray = checkArray(
                    sample.substr(arrayStart[0].length)
                )
                return assert.equal(JSON.stringify(extractedArray.value), JSON.stringify(expectation));
            } else {
                done(`no array start in "${sample}"`)
            }
        })
    })
})


; describe('object validator'.cyan, function () {
    var sample = fs.readFileSync('./test/file-object.test').toString()
    var fieldError = fs.readFileSync('./test/error-object-field.test').toString()
    var separatorError = fs.readFileSync('./test/error-object-separator.test').toString()
    var unterminatedError = fs.readFileSync('./test/error-object-unterminated.test').toString()
    var expectation = JSON.parse(sample)

    it('should failed if neither property declarator or terminator is found', () => {
        let objectStart = unterminatedError.match(JSONGrammar.OBJECT[0])
        if (objectStart) {
            assert.throws(
                () => checkObject(unterminatedError.substr(objectStart[0].length)),
                SyntaxError,
                /neither key nor object terminator found/
            )
        } else {
            done(`no object start in "${unterminatedError}"`)
        }
    })
    it('should failed if no terminator is found', () => {
        let objectStart = separatorError.match(JSONGrammar.OBJECT[0])
        if (objectStart) {
            assert.throws(
                () => checkObject(separatorError.substr(objectStart[0].length)),
                SyntaxError,
                /Every object value is either followed by comma or a object termination token/
            )
        } else {
            done(`no object start in "${separatorError}"`)
        }
    })
    it('should failed if no field assignment is found', () => {
        let objectStart = fieldError.match(JSONGrammar.OBJECT[0])
        if (objectStart) {
            assert.throws(
                () => checkObject(fieldError.substr(objectStart[0].length)),
                SyntaxError,
                /missing field separator/
            )
        } else {
            done(`no object start in "${fieldError}"`)
        }
    })
    describe(log(expectation), () => {
        it('should parse the same object as JSON.parse without reviver', () => {
            let objectStart = sample.match(JSONGrammar.OBJECT[0])
            if (objectStart) {
                let object = checkObject(
                    sample.substr(objectStart[0].length)
                )
                return assert.equal(JSON.stringify(object.value), JSON.stringify(expectation));
            } else {
                done(`no object start in "${sample}"`)
            }
        })
    })
})

; describe('object of array validator'.cyan, function () {
    var sample = fs.readFileSync('./test/file-object-of-array.test').toString()
    var expectation = JSON.parse(sample)
    describe(log(expectation), () => {
        it('should parse the same object as JSON.parse without reviver', () => {
            let arrayStart = sample.match(JSONGrammar.OBJECT[0])
            if (arrayStart) {
                let object = checkObject(
                    sample.substr(arrayStart[0].length)
                )

                return assert.equal(JSON.stringify(object.value), JSON.stringify(expectation));
            } else {
                done(`no array start in "${sample}"`)
            }
        })
    })
})

; describe('object of object validator'.cyan, function () {
    var sample = fs.readFileSync('./test/file-object-of-object.test').toString()
    var expectation = JSON.parse(sample)
    describe(log(expectation), () => {
        it('should parse the same object as JSON.parse without reviver', () => {
            let objectStart = sample.match(JSONGrammar.OBJECT[0])
            if (objectStart) {
                let object = checkObject(
                    sample.substr(objectStart[0].length)
                )

                return assert.equal(JSON.stringify(object.value), JSON.stringify(expectation));
            } else {
                done(`no object start in "${sample}"`)
            }
        })
    })
})

; describe('array of object validator'.cyan, function () {
    var sample = fs.readFileSync('./test/file-array-of-object.test').toString()
    var expectation = JSON.parse(sample)
    describe(log(expectation), () => {
        it('should parse the same array as JSON.parse without reviver', () => {
            let arrayStart = sample.match(JSONGrammar.ARRAY[0])
            if (arrayStart) {
                let array = checkArray(
                    sample.substr(arrayStart[0].length)
                )

                return assert.equal(JSON.stringify(array.value), JSON.stringify(expectation));
            } else {
                throw(`no array start in "${sample}"`)
            }
        })
    })
})