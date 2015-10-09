define([ '../ngmodule','underscore' ], function(appModule) {

    var objCopy = function(obj) {
        var keys = getKeys(obj);
        var copy = {};
        for ( var i in keys) {
            var key = keys[i];
            var value = obj[key];
            if (false == _.isFunction(value)) {
                copy[key] = value;
            }
        }
        return copy;
    }

    var getKeys = function(obj) {
        return _.keys(obj).filter(function(i) {
            return !/^\$\$/.test(i)
        })
    }
    
    var objEqual = function(obj1, obj2) {
        var keys = getKeys(obj1);
        for ( var i in keys) {
            var key = keys[i];
            var val1 = obj1[key];
            var val2 = obj2[key];
            if (val1 == val2) {
                continue;
            } else {
                return false;
            }
        }
        return true;
    }

    var objectService={
            copy:objCopy,
            equal:objEqual,
    }
    
    appModule.value('objectService', objectService);

});