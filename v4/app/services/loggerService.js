define(['../ngmodule'], function(appModule){
    appModule.factory('loggerService', function(){
       var loggerService={
               scope:null, //has to be set before usage
       };
       
       loggerService.infoNonNg=function(msg){
           loggerService.scope.$apply(function(){
               loggerService.scope.statusInfo(msg);
           })
       }

       loggerService.errorNonNg=function(msg){
           loggerService.scope.$apply(function(){
               loggerService.scope.statusError(msg);
           })
       }
       
       return loggerService;
    });
})