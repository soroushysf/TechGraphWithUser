/**
 * Created by soroush on 4/4/17.
 */

angular.module('graphController', [])

    .controller('graphExploreCtrl', function ($scope, graphData, d3Link, d3Node) {
        var graphExplore = this;
        graphExplore.links = [], graphExplore.nodes = [];
        graphExplore.title = "Graph View";
        $scope.links = [], $scope.nodes = [];

        // declared in graph directive (graphData => 0: titles, 1: nodes, 2: links)
        $scope.$on("nodeDoubleClick",function (event ,data) {
             graphData.nodeDoubleClick(data)
                 .then(function (result) {
                    var finalData = graphData.nodeDoubleClickFinalResult(graphData.joinPrevAndCurrentData(result));
                         console.log(finalData);
                     $scope.links = finalData.createdLinks;
                     $scope.nodes = finalData.createdNodes;
                     $scope.nodeCounts = finalData.createdNodes.length;
                     $scope.linkCounts = finalData.createdLinks.length;
                 })


        });

        graphData.httpRequest('/traverse',firstTraverseData)
            .then(function (result) {
                // graphData.setGraphData(result.techs, result.associations);
                graphExplore.nodes = d3Node.createNode(result.techs);
                graphExplore.links = d3Link.createLink(result.associations);
                graphExplore.links = d3Link.filterLinkByTh(d3Link.filterLinks(graphExplore.links, graphExplore.nodes) ,0.2);


                $scope.nodeCounts = graphExplore.nodes.length;
                $scope.linkCounts = graphExplore.links.length;
                $scope.nodes = graphExplore.nodes;
                $scope.links = graphExplore.links;

            });


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