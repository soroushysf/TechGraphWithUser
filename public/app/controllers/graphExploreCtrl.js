/**
 * Created by soroush on 4/4/17.
 */

angular.module('graphController', [])

    .controller('graphExploreCtrl', function ($scope, graphData, d3Link, d3Node, $timeout) {
        var graphExplore = this;
        graphExplore.links = [], graphExplore.nodes = [];
        graphExplore.title = "جست و جو در گراف";
        $scope.links = [], $scope.nodes = [];
        graphExplore.threshHoldSpinner = false;
        $scope.searchBarSpinner = false;


        $scope.minimumThreshHold = graphData.getThreshHold();

        // get the initial graph data
        // if there are data in service else request server for data
        if(graphData.getNodes() || graphData.getAssociations()) {
            var nodes = graphData.getNodes();
            var links = graphData.getAssociations();
            $scope.nodeCounts = nodes.length;
            $scope.linkCounts = links.length;
            $scope.nodes = nodes;
            $scope.links = links;
        } else {
            graphData.httpRequest('/traverse',firstTraverseData)
                .then(function (result) {
                    // graphData.setGraphData(result.techs, result.associations);
                    graphExplore.nodes = d3Node.createNode(result.techs);
                    graphExplore.links = d3Link.createLink(result.associations);
                    graphExplore.links = d3Link.filterLinkByTh(d3Link.filterLinks(graphExplore.links, graphExplore.nodes) ,0.2);

                    graphData.setGraphData(graphExplore.nodes, graphExplore.links);
                    $scope.nodeCounts = graphExplore.nodes.length;
                    $scope.linkCounts = graphExplore.links.length;
                    $scope.nodes = graphExplore.nodes;
                    $scope.links = graphExplore.links;

                });
        }

        graphExplore.saveGraph = function () {
            var nodes = d3Node.createNodeV2(graphData.getNodes());
            var links = d3Link.createLinkDoubleCLick(graphData.getAssociations());
            var sendingData = {
                nodes: nodes,
                links: links
            };
            graphData.httpRequest('/saveGraph', sendingData)
                .then(function (result) {
                    console.log(result);
                })



        };
        $scope.undoGraph = function () {
            var data = graphData.getPreviousData();
            // graphData.setPreviousData($scope.nodes, $scope.links);
            $scope.nodes = data.nodes;
            $scope.links = data.links;
        }
        // declared in graph directive (graphData => 0: titles, 1: nodes, 2: links)
        $scope.$on("nodeDoubleClick",function (event ,data) {
            graphData.setPreviousData($scope.nodes, $scope.links);
            graphData.nodeDoubleClick(data)
                .then(function (result) {
                    var finalData = graphData.finalResultsFiltering(graphData.resultsConcat(result));
                    graphData.setGraphData(finalData.createdNodes, finalData.createdLinks);
                    $scope.links = finalData.createdLinks;
                    $scope.nodes = finalData.createdNodes;
                    $scope.nodeCounts = finalData.createdNodes.length;
                    $scope.linkCounts = finalData.createdLinks.length;

                })


        });

        graphExplore.setThreshHold = function (threshHold) {
            graphExplore.threshHoldSpinner = true;
            $timeout(function () {
                graphExplore.threshHoldSpinner = false;
            }, 500);
            graphData.setThreshHold(threshHold);
            $scope.minimumThreshHold = graphData.getThreshHold();
        };

        $scope.searchBarGetData = function (field) {

            graphData.setExploredNodeName(field.queryInput);
            graphData.setPreviousData($scope.nodes, $scope.links);
            $scope.exploredNodeName = graphData.getExploredNodeName();

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
                    graphData.setGraphData(finalData.createdNodes, finalData.createdLinks);
                    $scope.links = finalData.createdLinks;
                    $scope.nodes = finalData.createdNodes;
                    $scope.nodeCounts = finalData.createdNodes.length;
                    $scope.linkCounts = finalData.createdLinks.length;

                });


            $('#weightBtn').removeClass('btn-success').addClass('btn-default');
            $('#weightBtn').html('Off');

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