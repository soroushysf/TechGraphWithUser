/**
 * Created by soroush on 4/4/17.
 */
var request = require('request-promise'),
    Promise = require('bluebird')
;
var traverse = require('../orientDBRequests/traverse'),
    queryByNodeTitle = require('../orientDBRequests/queryByNodeTitle'),
    queryByNodeId = require('../orientDBRequests/queryByNodeId'),
    queryByLinks = require('../orientDBRequests/queryByLinks'),
    User = require('../models/user')
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

    router.post('/nodeNames', function (req, res) {
        var nodeNames = req.body, databaseRequests = [];

        for(var i = 0; i < nodeNames["nodeNames"].length; i++) {
            databaseRequests.push(
                queryByNodeTitle.getNodesData(nodeNames["nodeNames"][i], request)
            );
        }
        Promise.all(databaseRequests)
            .then(function (result) {
                var nodeResult = result.map(function (el) {
                    return JSON.parse(el)["result"][0]["@rid"].replace(/#/g, '');
                });

                databaseRequests = [];


                for(var i = 0; i < nodeResult.length; i++) {
                    databaseRequests.push(
                        traverse.traverseDB(nodeResult[i], nodeNames["traverseDepth"],request)
                    );
                }
                Promise.all(databaseRequests)
                    .then(function (result) {
                        // console.log(JSON.parse(result[1]));
                        result = result.map(function(el){
                            return JSON.parse(el)["result"];
                        });
                        if(result[1]) {
                            for (var i = 1; i < result.length; i++) {
                                result[i] = result[i].concat(result[i-1]);
                            }
                        }
                        result = result.splice(result.length - 1, result.length)[0];
                        // console.log(result);

                        var graph = {techs : [], associations : []};

                        graph.techs = result.filter(function (el) {
                            return( el["@class"] === "techs");
                        });

                        graph.techs = removeDuplicates(graph.techs, "tech_title");

                        graph.associations = result.filter(function (el) {
                            return( el["@class"] === "associations");
                        });
                        graph.associations = removeDuplicates(graph.associations, "@rid");

                        res.json({ data: graph});
                        // console.log(graph.techs);
                        // console.log(graph.associations);

                    });
            })
            .catch(function (err, st) {
                console.log(st);
                res.send(err);
            })
    });

    router.post('/saveGraph', function (req, res) {
        var graph = req.body;

        User.findOne({ email: req.decoded.email}).select('graphs').exec(function(err, user) {
            if(err) throw err;
            user.graphs.push(graph);

            if(!user) {
                res.json({ success: false, message: "user is not authenticated"});
            } else {
                user.update({ graphs: user.graphs}, function (err) {
                    if(err) {
                        res.json({ data: "was not saved"});
                    }
                    res.json({ data: "saved"});

                });
            }

        });

    });

    return router;
};

function removeDuplicates(arr, prop) {
    var new_arr = [];
    var lookup  = {};

    for (var i in arr) {
        lookup[arr[i][prop]] = arr[i];
    }

    for (i in lookup) {
        new_arr.push(lookup[i]);
    }

    return new_arr;
}