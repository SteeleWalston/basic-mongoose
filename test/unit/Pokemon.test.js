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
    });

});