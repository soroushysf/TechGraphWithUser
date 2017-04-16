/**
 * Created by soroush on 4/5/17.
 */

angular.module('graphController')

.controller('graphTableController', function ($scope, graphData, graphTableService, $timeout) {

    $scope.graphTableTitle = 'Graph Table';

    if(graphTableService.getNodes()) {
        $scope.nodes = graphTableService.getNodes();
    }

    $scope.searchBarGetData = function (field) {
        $scope.searchBarSpinner = true;
        var sendingData ={
                qry :  JSON.stringify(field.queryInput),
                threshHold : graphData.getThreshHold()

            }
        ;

        graphData.httpRequest('/queryGraph', sendingData)

            .then(function (data, status, headers, config) {
                $scope.searchBarSpinner = false;
                var finalData = graphData.finalResultsFiltering(graphData.resultsConcat(data));
                graphTableService.setNodes(finalData.createdNodes);
                $scope.nodes = finalData.createdNodes;


            });
    };


    $scope.setThreshHold = function (threshHold) {
        $scope.threshHoldSpinner = true;
        $timeout(function () {
            $scope.threshHoldSpinner = false;
        }, 500);
        graphData.setThreshHold(threshHold);
    };

    $scope.currentPage = 1;

});
