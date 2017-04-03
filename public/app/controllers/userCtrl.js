/**
 * Created by soroush on 4/3/17.
 */

angular.module('userControllers', ['userServices'])

    .controller('regCtrl', function ($http, $location, $timeout, User) {
        var register = this;

        register.regUser = function (regData) {
            register.loading = true;
            register.errorMsg = false;

            User.create(regData)
                .then(function (data) {
                    register.loading = false;
                    if(data.data.success) {
                        register.successMsg = data.data.message;
                        $timeout(function () {
                            $location.path('/');
                        }, 2000)
                    } else {
                        register.loading = false;
                        register.errorMsg = data.data.message;
                    }
                });
        };

    });
