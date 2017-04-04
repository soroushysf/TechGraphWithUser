/**
 * Created by soroush on 4/3/17.
 */

angular.module('mainController', ['authServices'])

    .controller('mainCtrl', function ($rootScope, $scope, Auth, $timeout, $location, $interval, $window) {
        var main = this;
        main.loadme = false;

        main.successMsg = '';
        main.logoutMenu = Auth.isLoggedIn();

        main.checkSession = function () {
            if(Auth.isLoggedIn()) {
                main.checkingSession = true;
                var interval = $interval(function () {
                    var token = $window.localStorage.getItem('token');
                    if(!token) {
                        $interval.cancel(interval);
                    } else {
                        self.parseJwt = function (token) {
                            var base64Url = token.split('.')[1];
                            var base64 = base64Url.replace('-', '+').replace('_', '/');
                            return JSON.parse($window.atob(base64));
                        }
                        var expireTime = self.parseJwt(token);
                        var timeStamp = Math.floor(Date.now() / 1000);
                        var timeCheck = expireTime.exp - timeStamp;
                        if(timeCheck < 1) {
                            main.logoutMenu = false;
                            main.logout();
                            $interval.cancel(interval);
                        } else {

                        }
                        console.log(timeCheck);
                    }
                }, 2000);
            }
        };
        main.checkSession();

        $rootScope.$on('$routeChangeStart', function () {
            main.logoutMenu = Auth.isLoggedIn();
            if(!main.checkingSession) {
                main.checkSession();
            }

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
                            main.checkSession();
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
