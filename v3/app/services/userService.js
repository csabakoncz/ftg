define([ '../ngmodule', 'parse' ], function(appModule, Parse) {
    appModule.factory('userService', function(){
       return {
           updateUserInfo : function(userInfoStorage){
               var user = Parse.User.current();
               userInfoStorage.user = user;
               userInfoStorage.username = '';
               if(user){
                   userInfoStorage.username = user.escape('username'); 
               }
           },

           login:function(username,password,successCallback){
               Parse.User.logIn(username, password, {
                   error : function(error) {
                       console.log(error);
                       alert('Error logging in: code:' + error.code + ', message: ' + error.message)
                   },
                   success : function(user) {
                       successCallback();
                   }
               });
           },
           
           logout:function(){
               Parse.User.logOut();
           }
       } 
    });
});