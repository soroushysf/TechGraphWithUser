/**
 * Created by soroush on 4/3/17.
 */

angular.module('mainController', ['authServices'])

    .controller('mainCtrl', function ($rootScope, $scope, Auth, $timeout, $location) {
        var main = this;
        main.loadme = false;

        main.successMsg = '';
        main.logoutMenu = Auth.isLoggedIn();


        $rootScope.$on('$routeChangeStart', function () {
            main.logoutMenu = Auth.isLoggedIn();

            if(Auth.isLoggedIn()) {
                Auth.getUser()
                    .then(function (data) {
                        main.username = data.data.username;
                        main.loadme = true;

                    })
            } else {
                main.username = '';
                main.loadme = true;

            }

        });
        main.login = function (loginData) {
            main.loading = true;
            main.errorMsg = false;

            Auth.login(loginData)
                .then(function (data) {
                    if(data.data.success) {
                        main.loading = false;

                        main.successMsg = data.data.message;

                        $timeout(function () {
                            $location.path('/profile');
                            main.loginData = '';
                            main.successMsg = '';
                        }, 2000);
                    } else {
                        main.loading = false;
                        main.errorMsg = data.data.message;

                    }

                });
        };

        main.logout = function () {
            Auth.logout();
            $location.path('/');

        }
    });
