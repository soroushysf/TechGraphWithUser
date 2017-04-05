angular.module('techGraph',
    [   'appRoutes',
        'userControllers',
        'ngAnimate',
        'mainController',
        'authServices',
        'techDirectives',
        'graphController',
        'graphServices',
        'd3Services',
        'angularUtils.directives.dirPagination'
    ])

    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptors');
    });