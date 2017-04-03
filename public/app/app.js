angular.module('techGraph', ['appRoutes', 'userControllers', 'ngAnimate', 'mainController', 'authServices'])

.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});