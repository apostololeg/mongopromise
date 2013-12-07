/**
 * Wrap over Mongoskin for easy access to databases and collestions.
 *
 * @author Oleg Apostol <truerenton@gmail.com>
 * @copyright Oleg Apostol 2013
 * @license MIT
 * @version 0.0.1
 */
'use strict';

var mongoskin = require('mongoskin'),
    Promise = require('vow').promise,
    config = require('../.config.json'),
    utils = require('./utils.js');

/**
 * @constructor БД
 *
 * @param {string} name
 * @param {string} host
 * @param {string|number} port
 */
function Database(name, host, port) {
    var dbHost = host || config.db.host,
        dbPort = port || config.db.port;

    this.db = mongoskin.db(
        dbHost + ':' + dbPort + '/' + name,
        { safe: true }
    );
}

/**
 * Обвязка над методом, возвращающим коллекцию.
 * Служит для апгрейда методов (сахар + promise)
 *
 * @param {string} name – имя коллекции
 * @return {object} класс-обвязка над коллекцией
 */
Database.prototype.collection = function(name) {

    return new Collection(this.db.collection(name));

};

/**
 * @constructor коллекции
 *
 * @param {object} collection
 */
function Collection(collection) {

    this.collection = collection;

}

/**
 * Дополняем метод коллекции промисом
 *
 * @param {string} method – метод коллекции
 * @return {object} промис
 */
function patch(method) {

    return function() {

        var ctx = this,
            collection = this.collection,
            promise = Promise(),
            args = Array.prototype.slice.call(arguments);

        // Обработка ошибок
        function callback(err, data) {
            if(err) {
                promise.reject(err);
            } else {

                /**
                 * промис возвращает только 1 аргумент,
                 * но для методов-геттеров нужно возвращаться еще и результат выполнения,
                 * поэтому фулфилим объект.
                 */
                promise.fulfill({
                    collection: ctx,
                    data: data
                });
            }
        }

        // преобразовываем полученные данные в массив
        function getterCallback(err, cursor) {
            !err && cursor.toArray(callback);
        }

        // дополняем аргументы коллбеком для обработки ответа
        args.push(method === 'find' ? getterCallback : callback);

        // вызываем нативный метод
        collection[method].apply(collection, args);

        return promise;

    };

}

/**
 * Дополняем прототип пропатчеными методами
 */
utils.extend(Collection.prototype, {
    insert: patch('insert'),
    update: patch('update'),
    remove: patch('remove'),
    find: patch('find'),
    findOne: patch('findOne')
});

module.exports = Database;
