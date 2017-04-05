/**
 * Created by soroush on 4/5/17.
 */

angular.module('graphServices')

.service('searchTechService', function () {
    var searchTechService = this;
    var drawData = {};
    searchTechService.setGraphData = function (nodes,associations) {
        drawData.nodes = nodes;
        drawData.associations = associations;
    };
    searchTechService.getNodes = function () {
        return drawData.nodes;
    };
    searchTechService.getAssociations = function () {
        return drawData.associations;
    };
});