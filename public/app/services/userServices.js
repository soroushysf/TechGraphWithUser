/**
 * Created by soroush on 4/3/17.
 */
angular.module('userServices', [])

.service('User', function ($http) {
   var userService = this;

    userService.create = function (regData) {
        return $http.post('/api/users', regData);
    }

});