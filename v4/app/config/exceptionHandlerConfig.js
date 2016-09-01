define([ '../ngmodule' ], function(appModule) {

    appModule.config(function($provide) {
        $provide.decorator('$exceptionHandler', function($delegate) {
            var appHandler = function(exception, cause) {
                // delegate it to the original handler:
                $delegate(exception, cause);
                
                //can not inject $rootScope here, there is a circular reference
//                $rootScope.$broadcast('exceptionOccurred', exception, cause);
            }
            return appHandler;
        });
    });
});