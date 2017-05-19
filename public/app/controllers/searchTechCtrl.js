/**
 * Created by soroush on 4/5/17.
 */

angular.module('graphController')

.controller('searchTechController', function ($scope, graphData, $location, d3Node, d3Link) {

    $scope.inputs = [{}];
    $scope.itemValue = [];

    $scope.addField=function(){
        if($scope.inputs.length < 10) {
            $scope.inputs.push({})
        }
    };
    $scope.deleteField=function(){
        if( 1 < $scope.inputs.length) {
            $scope.inputs.splice(-1,1);
            // $scope.itemValue.splice( -1,1);
        }
    };

    $scope.searchGraph = function (view) {
        graphData.setThreshHold($scope.threshHold);

        var sendingData =  {
            nodeNames : $scope.itemValue.map(function (el) {
                return JSON.stringify(el);
            }),
            traverseDepth : typeof $scope.traverseDepth !== 'undefined' ? $scope.traverseDepth * 2 : 1,
            threshHold : $scope.threshHold
        };
        graphData.httpRequest('/nodeNames', sendingData)
            .then(function (result) {
                var finalData = {};
                finalData.links = d3Link.createLink(result["associations"]);
                finalData.nodes = d3Node.filterNodes(d3Node.createNode(result["techs"]), finalData.links);
                finalData.links = d3Link.filterLinks(finalData.links, finalData.nodes);

                finalData.searchedTechNames = $scope.itemValue;

                //send data to second page controller by main controller
                $location.path(view);
                $scope.$emit('searchedGraphData', finalData);


            });
    };


});