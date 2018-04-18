const { assert } = require('chai');
const Pokemon = require('../../lib/models/Pokemon');

describe('Pokemon model', () => {

    it('valid good model', () => {
        const data = {
            name: 'Bulbasaur',
            type: 'Grass',
            location: 'Professor Oaks Lab',
            metaData: {
                strongAgainst: 'Water',
                weakAgainst: 'Fire'
            },
            dexNum: 1
        };

        const pokemon = new Pokemon(data);
        assert.deepEqual(pokemon.toJSON(), {
            _id: pokemon._id,
            ...data
        });

        assert.isUndefined(pokemon.validateSync());
    });

    const getValidationErrors = validation => {
        assert.isDefined(validation, 'expected validation errors');
        return validation.errors;
    };

    it('required fields', () => {
        const pokemon = new Pokemon({});
        const errors = getValidationErrors(pokemon.validateSync());
        assert.equal(Object.keys(errors).length, 2);
        assert.equal(errors.name.kind, 'required');
        assert.equal(errors.type.kind, 'required');
    });

});