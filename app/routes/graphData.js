/**
 * Created by soroush on 4/4/17.
 */
var request = require('request-promise');
var traverse = require('../orientDBRequests/traverse'),
    queryByNodeTitle = require('../orientDBRequests/queryByNodeTitle'),
    queryByNodeId = require('../orientDBRequests/queryByNodeId'),
    queryByLinks = require('../orientDBRequests/queryByLinks')
;
module.exports = function(router) {

    router.post('/traverse', function (req, res) {
        var nodeArray = req.body.nodes;
        traverse.traverseDB(nodeArray, 1, request)
            .then(function (result) {
                result = JSON.parse(result);
                var graph = {techs : {}, associations : {}};

                graph.techs = result["result"].filter(function (el) {
                    return( el["@class"] === "techs");
                });
                graph.associations = result["result"].filter(function (el) {
                    return( el["@class"] === "associations");
                });
                res.json({ data: graph});
            })
            .catch(function (err, st) {
                res.send(st);
            })
    });
    router.post('/queryGraph', function (req, res) {
        var queryData = req.body;
        queryByNodeTitle.getNodesData(queryData["qry"], request)
            .then(function (result) {
                var centerNodeId = JSON.parse(result), finalResult;
                var dataSend = {
                    nodeId : centerNodeId["result"][0]["@rid"].replace(/#/g, ''),
                    nodeTitle : centerNodeId["result"][0]["tech_title"],
                    nodeDependencies : centerNodeId["result"][0]["out"].concat(centerNodeId["result"][0]["in"]).map(function (id) {
                        return id.replace(/#/g, '');
                    })
                };

                queryByNodeId.getNodesData(dataSend, request)
                    .then(function (nodes) {

                        queryByLinks.getLinksData(dataSend.nodeId, request)
                            .then(function (links) {
                                finalResult = {
                                    nodeDp : nodes,
                                    centerNode : centerNodeId,
                                    links : JSON.parse(links)
                                };
                                res.json({ data : finalResult});
                            });
                    })
            })
            .catch(function (err) {
                res.send(err);
            })
    });

    return router;
};
