/**
 * Created by soroush on 4/5/17.
 */

angular.module('graphController')

.controller('searchTechViewController', function ($scope, graphData, searchTechService, $timeout) {



    if(searchTechService.getNodes() || searchTechService.getAssociations()) {
        var nodes = searchTechService.getNodes();
        var links = searchTechService.getAssociations();
        $scope.nodeCounts = nodes.length;
        $scope.linkCounts = links.length;
        $scope.nodes = nodes;
        $scope.links = links;
    } else {
        $scope.links = [] ; $scope.nodes = [];
    }
    $scope.$on('searchedGraphDataFromMainCtrl',function (event, data) {
        $scope.links = data["links"];
        $scope.nodes = data["nodes"];
        $scope.nodeCounts = data["nodes"].length;
        $scope.linkCounts = data["links"].length;
        $scope.searchedTechs = data["searchedTechNames"];

    });
    // declared in graph directive (graphData => 0: titles, 1: nodes, 2: links)
    $scope.$on("nodeDoubleClick",function (event ,data) {
        graphData.nodeDoubleClick(data)
            .then(function (result) {
                var finalData = graphData.finalResultsFiltering(graphData.resultsConcat(result));
                searchTechService.setGraphData(finalData.createdNodes, finalData.createdLinks);
                $scope.links = finalData.createdLinks;
                $scope.nodes = finalData.createdNodes;
                $scope.nodeCounts = finalData.createdNodes.length;
                $scope.linkCounts = finalData.createdLinks.length;
            })


    });

    $scope.setThreshHold = function (threshHold) {
        $scope.threshHoldSpinner = true;
        $timeout(function () {
            $scope.threshHoldSpinner = false;
        }, 500);
        graphData.setThreshHold(threshHold);
    };
    $scope.weightToggle = function () {
        $('#weightBtn').toggleClass('btn-default').toggleClass('btn-success');

        if($('#weightBtn').hasClass('btn-success')){
            $('#weightBtn').html('On');
        } else {
            $('#weightBtn').html('Off')
        }
        $scope.$broadcast("weightToggle");
    };
});