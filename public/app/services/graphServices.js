/**
 * Created by soroush on 4/4/17.
 */

angular.module('graphServices', [])

.service('graphData', function ( $http, d3Node, d3Link) {
    var graphDataRequest = this;
    var drawData = {};
    var ThreshHold = 0.2;
    var exploredNode = '';
    var previousData = {};

    graphDataRequest.setExploredNodeName = function (data) {
        exploredNode = data;
    };
    graphDataRequest.getExploredNodeName = function () {
      return exploredNode;
    };
    graphDataRequest.httpRequest = function (path, data) {
        return $http.post('/graph'+ path, data)
            .then(function (result) {
                return result.data.data;
            })
    };
    graphDataRequest.getNodeNames = function (inputString) {
        var bodyJson = {
            input : inputString
        };
      return $http.post('/graph/node-names', bodyJson);
    };
    graphDataRequest.setGraphData = function (nodes,associations) {
        drawData.nodes = nodes;
        drawData.associations = associations;
    };
    graphDataRequest.getNodes = function () {
        return drawData.nodes;
    };
    graphDataRequest.getAssociations = function () {
        return drawData.associations;
    };

    graphDataRequest.setThreshHold = function (value) {
        ThreshHold = value;
    };
    graphDataRequest.getThreshHold = function () {
        return ThreshHold;
    };
    // called from graphExplore controller (graphData => 0: titles, 1: nodes, 2: links)

    graphDataRequest.nodeDoubleClick = function (doubleClickData) {

        var sendingData ={
            qry :  JSON.stringify(doubleClickData[0]),
            limit : 1,
            threshHold : graphDataRequest.getThreshHold()

        };

       return graphDataRequest.httpRequest('/queryGraph', sendingData)
            .then(function (data) {

                var successData = this;
                successData.fetchedData = data;

                //filtering data to draw the new graph

                doubleClickData[1] = d3Node.createNodeV2(doubleClickData[1]);

                doubleClickData[2] = d3Link.createLinkDoubleCLick(doubleClickData[2]);

                //------filtering ended---------//
                successData.fetchedData["prevNodes"] = doubleClickData[1];
                successData.fetchedData["prevLinks"] = doubleClickData[2];

              return  successData.fetchedData;
            })


    };
    graphDataRequest.setPreviousData = function (nodes, links) {
        previousData.nodes = d3Node.createNodeV2(nodes);
        previousData.links = d3Link.createLinkDoubleCLick(links);
    }
    graphDataRequest.getPreviousData = function () {
        return previousData;
    }
    graphDataRequest.resultsConcat = function (data) {
        // $scope.$broadcast("graphTableData", data);
        var crNodes=[], crLinks=[];


        data["nodeDp"] = data["nodeDp"].concat(data["centerNode"]);


        crNodes = d3Node.createNodeV2(data["nodeDp"]);

        crLinks = d3Link.createLink(data["links"]["result"]);





        //filters out repeated nodes and links

        if(data["prevNodes"]) {

            for(var i = 0 ; i < crLinks.length; i++) {
                data["prevLinks"] = data["prevLinks"].filter(function (link) {
                    return !(link["source"] === crLinks[i]["source"] && link["target"] === crLinks[i]["target"]);
                })
            }
            for(var j = 0 ; j < crNodes.length; j++) {
                data["prevNodes"] = data["prevNodes"].filter(function (node) {
                    return !(node["title"] === crNodes[j]["title"]);
                })
            }

            crLinks = crLinks.concat(data["prevLinks"]);
            crNodes = crNodes.concat(data["prevNodes"]);


        }
        // ----------------------------------------


        var completeData = {
            crLinks : crLinks,
            crNodes : crNodes
        };
        return completeData;
        // $scope.$broadcast("graphControllerData", completeData);
    }

    graphDataRequest.finalResultsFiltering = function (data) {
        var finalResults = this;
        $('#weightBtn').removeClass('btn-success').addClass('btn-default');
        $('#weightBtn').html('Off');



        finalResults.createdLinks = data["crLinks"];
        finalResults.createdNodes = d3Node.filterNodes(data["crNodes"], data["crLinks"]);

        finalResults.createdLinks.forEach(function (link) {
            finalResults.createdNodes.forEach(function (node) {
                if (node.id === link.source || node.id === link.target) {
                    node.edgeCount++;
                }
            })
        });

        finalResults.nodeCounts = finalResults.createdNodes.length;
        finalResults.linkCounts = finalResults.createdLinks.length;

        return finalResults;
    }
});

