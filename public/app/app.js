angular.module('techGraph', ['appRoutes', 'userControllers', 'ngAnimate', 'mainController', 'authServices', 'techDirectives'])

.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});