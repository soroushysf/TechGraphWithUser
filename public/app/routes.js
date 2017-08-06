var app = angular.module('appRoutes', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        $routeProvider

            .when('/about', {
                templateUrl: "app/views/pages/about.html"
            })
            .when('/register', {
                templateUrl: "app/views/pages/users/register.html",
                authenticated: false
            })
            .when('/', {
                templateUrl: "app/views/pages/users/login.html",
                authenticated: false
            })
            .when('/profile', {
                templateUrl: "app/views/pages/users/profile.html",
                authenticated: true
            })
            .when('/graphExplore', {
                templateUrl: "app/views/pages/graph/graphExplore.html",
                authenticated: true
            })
            .when('/graphTable', {
                templateUrl: "app/views/pages/graph/graphTable.html",
                authenticated: true
            })
            .when('/searchTechsFirstPage', {
                templateUrl: "app/views/pages/graph/searchTechsFirst.html",
                authenticated: true
            })
            .when('/searchTechsSecondPage', {
                templateUrl: "app/views/pages/graph/searchTechsSecond.html",
                authenticated: true
            })
            .otherwise({redirectTo: '/'})
    });







app.run(['$rootScope', 'Auth', '$location', function ($rootScope, Auth, $location) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {

        if(next.$$route.authenticated == true) {
            if(!Auth.isLoggedIn()) {
                event.preventDefault();
                $location.path('/');
            }

        } else if (next.$$route.authenticated == false) {
            if(Auth.isLoggedIn()) {
                event.preventDefault();
                $location.path('/');
            }

        }

    });
}]);




