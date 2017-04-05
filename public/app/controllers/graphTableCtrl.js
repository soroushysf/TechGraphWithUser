/**
 * Created by soroush on 4/5/17.
 */

angular.module('graphController')

.controller('graphTableController', function ($scope, graphData, graphTableService) {


    $scope.graphTableTitle = 'Graph Table';

    if(graphTableService.getNodes()) {
        $scope.nodes = graphTableService.getNodes();
    }

    $scope.searchBarGetData = function (field) {
        $scope.searchBarSpinner = true;
        var sendingData ={
                qry :  JSON.stringify(field.queryInput)
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


    $scope.currentPage = 1;

});
