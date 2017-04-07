/**
 * Created by soroush on 4/7/17.
 */

angular.module('userServices')

    .service('userGraphs', function () {
        var userGraphs = this;
        var graphData= [];
        userGraphs.setData = function (value) {
            graphData = value;
        }
        userGraphs.getData = function () {
            return graphData;
        }
    });
