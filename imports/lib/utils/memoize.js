/**
 * Created by abbeymart on 2017-09-23
 */

Function.prototype.memoized = function() {
    let key            = JSON.stringify( arguments );
    this._cache        = this._cache || {};
    this._cache[ key ] = this._cache[ key ] ||
                         this.apply( this, arguments );
    return this._cache[ key ];
};
Function.prototype.memoize = function() {
    let fn = this;
    if( fn.length === 0 || fn.length > 1 ) {
        return fn;
    }
    return function() {
        return fn.memoized.apply( fn, arguments );
    };
};
