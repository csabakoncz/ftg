define([ '../ngmodule', 'parse' ], function(appModule, Parse) {
    appModule.run(function() {
        // Initialize Parse with your Parse application javascript keys
//        Parse.initialize("3WQ9tsQ19Gb0QC2Ppx6I0NrYpkNaZCYP7eMH3ORJ", "1gcsuWx7ltLE2jPgxaxRK125TSNoAxa5emF1MSpZ");

        Parse.initialize("myAppId", "unused");
        Parse.serverURL="https://ftg-fushimisi.rhcloud.com/parse";
        //Parse.serverURL="http://localhost:1337/parse";
    })
});