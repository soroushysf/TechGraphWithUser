/**
 * Created by soroush on 4/4/17.
 */
angular.module('d3Services')
    .service('d3Node', function () {
        var d3Node = this;


        d3Node.createNode = function (nodesData) {

            nodesData = nodesData.map(function (node) {
                return {
                    'id' :   node["@rid"].replace(/#|:/g,''),
                    'title' :  node["tech_title"],
                    'edgeCount' : node.edgeCount || 0,
                    'cluster' : node.cluster || Math.floor(Math.random() * 5) + 10,
                    'icon' : ''
                };
            });
            for(var i = 0 ; i < nodesData.length; i++ ) {
                if(i < nodesData.length/2) {
                    nodesData[i]["icon"] = "person";

                } else {
                    nodesData[i]["icon"] = "tech";

                }
            }
            return nodesData;
        };

        d3Node.createNodeV2 = function (nodesData) {

            nodesData = nodesData.map(function (node) {
                return {
                    'id' :  node.id || node["result"][0]["@rid"].replace(/#|:/g,''),
                    'title' : node.title || node["result"][0]["tech_title"],
                    'edgeCount' : node.edgeCount || 0,
                    'cluster' : node.cluster || Math.floor(Math.random() * 5) + 10 ,
                    'icon' : ''
                };
            });
            for(var i = 0 ; i < nodesData.length; i++ ) {
                if(i < nodesData.length/2) {
                    nodesData[i]["icon"] = "person";

                } else {
                    nodesData[i]["icon"] = "tech";

                }
            }



            return nodesData;

        };

        // deletes isolated nodes from the graph (deletes nodes with no edge)
        d3Node.filterNodes = function (nodes, links) {
            return nodes.filter(function (node) {
                var checkNode = false;
                for(var i = 0; i < links.length; i++) {
                    if(links[i].source === node.id || links[i].target === node.id) {
                        checkNode = true;
                    }
                }
                return checkNode;
            });
        }

    });