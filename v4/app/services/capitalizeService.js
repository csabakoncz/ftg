define([ '../ngmodule' ], function(appModule) {
    var capitalize = function(text) {
        if (text.length < 1) {
            return text;
        }

        var firstLetter = text.charAt(0).toUpperCase();
        return firstLetter + text.slice(1);
    }

    //no need to do this, the filter is injectable as "captitalizeFilter"
//    appModule.value('capitalizeService', capitalize);

    appModule.filter('capitalize', function() {
        return capitalize;
    });
});