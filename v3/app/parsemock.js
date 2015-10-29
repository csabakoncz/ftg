define([ 'underscore' ], function(_) {
    var Parse={};
   
    
    Parse.initialize=function(a,b){
        console.log('invoked Paser.initialize')
    }
    
    Parse.User={};
    Parse.User.current=function(){
        var username = localStorage.getItem('parsemock/currentUser');
        if(username){
            return {escape:function(){return username}};
        }
    }
    Parse.User.logIn=function(username, password, callbackObj){
        localStorage.setItem('parsemock/currentUser',username);
        setTimeout(callbackObj.success);
    }
    Parse.User.logOut=function(){
        localStorage.removeItem('parsemock/currentUser');
    }

    Parse.Object={};
    Parse.Object.extend=function(entityName, config){
        var constructor = function(){
            this.entityName = entityName;
        };
        constructor.prototype=config;
        return constructor;
    }
    
   
    Parse.Query=function(entityClass){
        this.entityClass=entityClass;
    };
    
    Parse.Query.prototype.select = function(fields){
      this.selectedFields = fields;  
    };
    Parse.Query.prototype.find = function(){
        //run query
    };
    
    return Parse;
});