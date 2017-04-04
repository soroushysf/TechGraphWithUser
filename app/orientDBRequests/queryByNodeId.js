/**
 * Created by soroush on 4/4/17.
 */

var Promise = require('bluebird')
;

function getNodesData(queryData, request) {


    var databaseRequests = [], optionsNode;

    for(var i = 0; i < queryData["nodeDependencies"].length; i++) {
        optionsNode = {
            url:  encodeURI('http://localhost:2480/query/tech_graph/sql/select out(),in(), * from techs where @rid ='+queryData["nodeDependencies"][i]),
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            auth: {
                username: 'root',
                password: 'root'
            }
        };

        databaseRequests.push(
            request(optionsNode, function (err, res, body) {
                return body;
            })
        );
    }
    return Promise.all(databaseRequests)
        .then(function (data) {

            return data.map(function (el) {
                return JSON.parse(el);
            });

        });


}

module.exports = {
    getNodesData : getNodesData
};