const mongoose = require('mongoose');
const { Schema } = mongoose;

const RequiredString = {
    type: String,
    required: true
};

const schema = new Schema({
    name: RequiredString,
    type: {
        ...RequiredString,
        enum: ['Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Poison', 'Dragon', 'Flying', 'Ground', 'Dark', 'Bug']
    },
    location: String,
    metaData: {
        strongAgainst: String, 
        weakAgainst: String,
    },
    dexNum: Number
});

module.exports = mongoose.model('Pokemon', schema);