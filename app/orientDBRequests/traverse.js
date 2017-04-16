/**
 * Created by soroush on 4/4/17.
 */

function traverseDB(nodesArray, traverseDepth, threshHold,request) {

    var optionsLink;
    optionsLink = {
        url:  encodeURI('http://localhost:2480/query/tech_graph/sql/select from (traverse * from '+nodesArray+' while $depth <= '+traverseDepth+') where (weight > '+threshHold+'  or tech_title != "" )  /1000'),
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
        auth: {
            username: 'root',
            password: 'root'
        }
    };

    return request(optionsLink, function (err, res, body) {
        return body;
    });
}

module.exports = {
    traverseDB : traverseDB
};