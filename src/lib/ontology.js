
module.exports = {
    ontology:{
        types: {
            domain: {  fields : {
                scenarii: ['types#test'],
                entity: 'string',
                repository:'string',
            }},
            test: { fields : {
                given: 'string',
                action: 'string',
                // expectation: 'object',
                expectation:'string',
            }},
            attribute: {fields : {
                name: 'string',
                value: 'string',
            }}
            //
        },
        collections: {
            // attributes: ['types#attribute'],
            attributes: ['string'],
        },
        //
    }
}