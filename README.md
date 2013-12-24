## Mongopromise
Wrap over Mongoskin for easy access to databases and collections.

### Methods

* insert
* update
* find
* findOne
* remove

[Full list of opportunities](http://docs.mongodb.org/manual/reference/method)

### Example
```js
var db = new Database('test');

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

```

#### .then()
Link of the chain of asynchronous method calls collections.

```js
...
.then(function(res) {
    return res.ctx.< method >(params);
})
...
```

* ``res`` – response from previous operation:
  * ``ctx`` – context of collection
  * ``data`` – result of executing a getter-methods
* ``method`` – method of collection to be executed asynchronously after the previous one in the chain
* ``params`` – parameters for the method

### License
[MIT](https://github.com/truerenton/Mongopromise/blob/master/LICENSE)
