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

    it('updates a pokemon', () => {
        char.type = 'Flying';

        return request.put(`/pokemons/${char._id}`)
            .send(char)
            .then(({ body }) => {
                assert.deepEqual(body, char);
                return Pokemon.findById(char._id).then(roundTrip); 
            })
            .then(updated => {
                assert.deepEqual(updated, char);
            });
    });

    const getFields = ({ _id, name, type, location }) => ({ _id, name, type, location });

    it('gets all pokemen but only by id, name, type, and location', () => {
        return request.get('/pokemons')
            .then(({ body }) => {
                assert.deepEqual(body, [bulb, char].map(getFields));
            });
    });

    it('queries pokemans', () => {
        return request.get('/pokemons?dexNum=1')
            .then(({ body }) => {
                assert.deepEqual(body, [bulb].map(getFields));
            });
    });

    it('deletes a pokemon', () => {
        return request.delete(`/pokemons/${char._id}`)
            .then(() => {
                return Pokemon.findById(char._id);
            })
            .then(found => {
                assert.isNull(found);
            });
    });

    it('returns 404 if pokemon not found', () => {
        return request.get(`/pokemons/${char._id}`)
            .then(response => {
                assert.equal(response.status, 404);
                assert.match(response.body.error, /^Pokemon id/);
            });
    });
});