const router = require('express').Router();
const Pokemon = require('../models/Pokemon');
const errorHandler = require('../error-handler');

module.exports = router
    .post('/', (req, res) => {
        Pokemon.create(req.body)
            .then(pokemon => res.json(pokemon))
            .catch(err => errorHandler(err, req, res));
    })
    
    .put('/:id', (req, res) => {
        Pokemon.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
            .then(pokemon => res.json(pokemon))
            .catch(err => errorHandler(err, req, res));
    })

    .get('/:id', (req, res) => {
        const { id } = req.params;

        Pokemon.findById(id)
            .lean()
            .then(pokemon => {
                if(!pokemon) {
                    errorHandler({
                        status: 404,
                        error: `Pokemon id ${id} does not exist`
                    }, req, res);
                }
                else res.json(pokemon);
            })
            .catch(err => errorHandler(err, req, res));
    })
    
    .get('/', (req, res) => {
        Pokemon.find(req.query)
            .lean()
            .select('name type location')
            .then(pokemons => res.json(pokemons))
            .catch(err => errorHandler(err, req, res));
    })
    
    .delete('/:id', (req, res) => {
        Pokemon.findByIdAndRemove(req.params.id)
            .then(removed => res.json({ removed }))
            .catch(err => errorHandler(err, req, res));
    });