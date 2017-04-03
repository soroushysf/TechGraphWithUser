/**
 * Created by soroush on 4/3/17.
 */

angular.module('authServices', [])

.service('Auth', function($http, AuthToken) {
    var authService = this;

    authService.login = function (loginData) {
        return $http.post('/api/authenticate', loginData)
            .then(function (data) {
                AuthToken.setToken(data.data.token);
                return data;
            })
    };

    authService.isLoggedIn = function () {
        if(AuthToken.getToken()){
            return true;
        } else {
            return false;
        }
    };

    authService.getUser = function () {
        if(AuthToken.getToken()) {
            return $http.post('/api/me');
        } else {
            $q.reject({ message: 'user has no token'});
        }
    };
    authService.logout = function () {
        AuthToken.setToken();
    };


})

.service('AuthToken', function($window) {
    var authTokenService = this;

    authTokenService.setToken = function (token) {
        if(token) {
            $window.localStorage.setItem('token', token);
        } else {
            $window.localStorage.removeItem('token');

        }
    }

    authTokenService.getToken = function () {
        return $window.localStorage.getItem('token');
    }
})

.service('AuthInterceptors', function (AuthToken) {
    var AuthInterceptors = this;
    AuthInterceptors.request = function (config) {

        var token = AuthToken.getToken();
        if(token) {
            config.headers['x-access-token'] = token;
        }
        return config;
    };

});