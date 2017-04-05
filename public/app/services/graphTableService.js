/**
 * Created by soroush on 4/5/17.
 */

angular.module('graphServices')

.service('graphTableService', function () {
    var graphTableService = this;
    var nodes = null;
    graphTableService.setNodes = function (values) {
        nodes = values;
    }

    graphTableService.getNodes = function () {
        return nodes;
    }
});
