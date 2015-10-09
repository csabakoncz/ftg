require.config({
    paths : {
        underscore : '../bower_components/underscore/underscore',
        jquery : '../bower_components/jquery/dist/jquery',
        angular : '../bower_components/angular/angular',
        angularUiRouter : '../bower_components/angular-ui-router/release/angular-ui-router',
        angularUiBootstrap : '../bower_components/angular-bootstrap/ui-bootstrap-tpls',
        parse : '../bower_components/parse/parse'
    },
    shim : {
        jquery : {
            exports : '$',
        },
        angular : {
            deps : [ 'jquery' ],
            exports : 'angular',
        },
        angularUiRouter : [ 'angular' ],
        angularUiBootstrap : [ 'angular' ],
        parse : {
            deps : [ 'underscore' ],
            exports : 'Parse',
        },
        underscore : {
            exports : '_',
        }
    },
    deps : [ 'main' ]
});