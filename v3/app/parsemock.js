define([ 'underscore' ], function(_) {
    var Parse={};
   
    Parse.initialize=function(a,b){
        console.log('invoked Paser.initialize')
    }
    
    Parse.Object={};
    Parse.Object.extend=function(entityName, config){
        var constructor = function(){
            this.entityName = entityName;
        };
        constructor.prototype=config;
        return constructor;
    }
    
    Parse.Collection={};
    Parse.Collection.extend=function(config){
        var constructor = function(){};
        constructor.prototype=config;
        return constructor;
    };
    
    return Parse;
});