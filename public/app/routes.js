var app = angular.module('appRoutes', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        $routeProvider
            .when('/', {
                templateUrl: "app/views/pages/home.html"
            })
            .when('/about', {
                templateUrl: "app/views/pages/about.html"
            })
            .when('/register', {
                templateUrl: "app/views/pages/users/register.html",
                authenticated: false
            })
            .when('/login', {
                templateUrl: "app/views/pages/users/login.html",
                authenticated: false
            })
            .when('/profile', {
                templateUrl: "app/views/pages/users/profile.html",
                authenticated: true
            })
            .otherwise({redirectTo: '/'})
    });







app.run(['$rootScope', 'Auth', '$location', function ($rootScope, Auth, $location) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {

        console.log(Auth.isLoggedIn());
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




