const { assert } = require('chai');
const request = require('./request');
const Pokemon = require('../../lib/models/Pokemon');
const { dropCollection } = require('./db');

describe('Pokemen API', () => {
    before(() => dropCollection('pokemons'));

    let bulb = {
        name: 'Bulbasaur',
        type: 'Grass',
        location: 'Professor Oaks Lab',
        metaData: {
            strongAgainst: 'Water',
            weakAgainst: 'Fire'
        },
        dexNum: 1
    };

    let char = {
        name: 'Charmander',
        type: 'Fire',
        location: 'Professor Oaks Lab',
        metaData: {
            strongAgainst: 'Grass',
            weakAgainst: 'Water'
        },
        dexNum: 4
    };

    let squirt = {
        name: 'Squirtle',
        type: 'Water',
        location: 'Professor Oaks Lab',
        metaData: {
            strongAgainst: 'Fire',
            weakAgainst: 'Grass'
        },
        dexNum: 7
    };

    it('saves a pokeman', () => {
        return request.post('/pokemons')
            .send(bulb)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.deepEqual(body, {
                    _id, __v,
                    ...bulb
                });
                bulb = body;
            });
    });

    const roundTrip = doc => JSON.parse(JSON.stringify(doc.toJSON()));

    it('gets pokemon by id', () => {
        return Pokemon.create(char).then(roundTrip)
            .then(saved => {
                char = saved;
                return request.get(`/pokemons/${char._id}`);
            })
            .then(({ body }) => {
                assert.deepEqual(body, char);
            });
    });
});