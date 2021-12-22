define([ 'angular','./app' ], function(angular) {

    if (window.location.hash.startsWith('#t=')) {
        let access_token=window.location.hash.slice(('#t=').length)
        localStorage.setItem('t',decodeURIComponent(access_token))
        console.log('access token stored')
        window.location.hash=''
    }

    angular.bootstrap(document.body, [ 'ftg.app' ]);
})