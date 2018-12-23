define([ 'underscore', 'jquery', 'jsyaml'], function(_, $, jsyaml) {
    var Parse={};
    Parse.baseUrl='https://csabakoncz.github.io/ftg-data/db/';
    Parse.apiBase='https://api.github.com/repos/csabakoncz/ftg-data/contents/db/'
   
    
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
    Parse.Object.extend=function(entityName){
        var constructor = function(){
            this.entityName = entityName;
        };
        constructor.prototype=Parse.Object;
        return constructor;
    }

    Parse.Object.save = function(config){
        var entity=this.entityName.toLowerCase();
        var stringContent = b64EncodeUnicode(jsyaml.safeDump(this, {skipInvalid:true}));

        var objId = config.newId? config.newId: this.id;
        var fileName = objId + '.yaml';
    
        var payload = {
            // branch: 'gh-pages',
            content: stringContent
        }

        if(config.sha){
            payload.sha = config.sha;
            payload.message = 'update '+ entity + ' ' +fileName;
        }
        else{
            payload.message = 'create '+ entity + ' '+ fileName;
        }

        var auth='n/a'
        if(Parse.User.current()){
            auth = Parse.User.current().auth
        }
        
        $.ajax({
            url: Parse.apiBase+entity+'/'+fileName,
            data: JSON.stringify(payload, null, 2),
            method: 'PUT',
            contentType: 'application/json',
            headers: {
                'Authorization': auth
            }
        }).then(function(data){
            config.success({
                id: objId,
                sha: data.content.sha
            })
        }, config.error)
    }
   
    Parse.Object.get=function(what){
        return this[what];
    };
    
   
    Parse.Query=function(entityClass){
        this.entityClass=entityClass;
    };
    
    Parse.Query.prototype.select = function(fields){
      this.selectedFields = fields;  
    };
    
    Parse.Query.prototype.get=function(objId,cbObj){
        var entity=this.entityClass.toLowerCase();
        $.get(Parse.baseUrl+entity+'/'+objId+'.yaml').then(function(response){
            response = jsyaml.load(response)
            response.id=objId;
            //add a Parse-like get function:
            response.get=function(what){
                return this[what];
            }
            cbObj.success(response)
        },cbObj.error);
    };

    function isYaml(uri){
        return /\.yaml$/.test(uri)
    }

    Parse.Query.prototype.find = function(cbObj, scope){
        //run query
        console.log('Query.find for '+JSON.stringify(this,null,2))
        var entity=this.entityClass.toLowerCase();
        $.get(Parse.apiBase+entity).then(function(response){

            //filter only a certain kind:
            response = response.filter(function(r){
                // return /\.json/.test(r.name)
                return /\.yaml/.test(r.name)
            })
            
            cbObj.success(response)
            response.forEach(function(r){
                r.id=r.name.split('.')[0];
                var uri = Parse.baseUrl+entity+'/'+r.name
                $.get(uri).then(function(content){
                    if(isYaml(uri) && typeof content == 'string'){
						content = jsyaml.load(content)
					}
                    scope.$apply(function(){
                        _.extend(r,content);
                    })
                })
            })
           }
        ,cbObj.error);
    };
    
    return Parse;

    function b64EncodeUnicode(str) {
        // first we use encodeURIComponent to get percent-encoded UTF-8,
        // then we convert the percent encodings into raw bytes which
        // can be fed into btoa.
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
        }));
    }

    function b64DecodeUnicode(str) {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(atob(str).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }

});