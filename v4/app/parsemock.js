define([ 'underscore', 'jquery' ], function(_, $) {
    var Parse={};
    Parse.baseUrl='https://csabakoncz.github.io/ftg/v4/db/';
    Parse.apiBase='https://api.github.com/repos/csabakoncz/ftg/contents/v4/db/'
   
    
    Parse.initialize=function(a,b){
        console.log('invoked Paser.initialize')
    }
    
    Parse.User={};
    Parse.User.current=function(){
        return Parse.User._current;
    }
    Parse.User.logIn=function(username, password, callbackObj){
        var auth="Basic "+btoa(username+':'+password)
        $.ajax({url:'https://api.github.com/user',headers:{Authorization:auth}}).then(function(userData){
            var name = userData.name||userData.login;
            Parse.User._current={
                    name:name,
                    auth: auth,
                    escape:function(){return this.name}
            };
            callbackObj.success();
        }, callbackObj.error);
    }
    Parse.User.logOut=function(){
        delete Parse.User._current;
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
    
    Parse.Query.prototype.get=function(objId,cbObj){
        var entity=this.entityClass.toLowerCase();
        $.get(Parse.baseUrl+entity+'/'+objId+'.json').then(function(response){
            response.id=objId;
            //add a Parse-like get function:
            response.get=function(what){
                return this[what];
            }
            cbObj.success(response)
        },cbObj.error);
    };

    Parse.Query.prototype.find = function(cbObj, scope){
        //run query
        console.log('Query.find for '+JSON.stringify(this,null,2))
        var entity=this.entityClass.toLowerCase();
        $.get(Parse.apiBase+entity).then(function(response){
            cbObj.success(response)
            response.forEach(function(r){
                r.id=r.name.split('.')[0];
                $.get(Parse.baseUrl+entity+'/'+r.name).then(function(content){
                    scope.$apply(function(){
                        _.extend(r,content);
                    })
                })
            })
           }
        ,cbObj.error);
    };
    
    return Parse;
});