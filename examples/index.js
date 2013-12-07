var Mongopromise = require('../lib/mongopromise.js');

var db = new Mongopromise('test');

db.collection('mycollection')
    .insert({ a: 1 })
    .then(function(res) {
        return res.collection.update({ a: 1 }, { a: 1, ololo: 1 });
    })
    .then(function(res) {
        return res.collection.insert({ a: 2 });
    })
    .then(function(res) {
        return res.collection.update({ a: 2 }, { a: 2, ololo: 2 });
    })
    .then(function(res) {
        return res.collection.insert({ a: 3 });
    })
    .then(function(res) {
        return res.collection.find({ a: 2 });
    })
    .then(function(res) {
        console.log({ find: res.data });
        return res.collection.findOne({ a: 3 });
    })
    .then(function(res) {
        console.log({ findOne: res.data });
    })
    .fail(function(err) {
        console.log( err );
    })
    .done();
