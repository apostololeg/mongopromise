'use strict';

/**
 * Расширяет один объект методами другого.
 *
 * @param {object} target
 * @param {object} source
 * @param {boolean} [deep] наследованные методы
 */
exports.extend = function(target, source, deep) {
    for(var i in source) {
        if(deep || source.hasOwnProperty(i)) {
            target[i] = source[i];
        }
    }

    return target;
};
