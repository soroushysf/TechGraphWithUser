/**
 * Created by soroush on 4/4/17.
 */


function getNodesData(queryData, request) {

    var options = {
        url:  encodeURI('http://localhost:2480/query/tech_graph/sql/select out(),in(), * from techs where tech_title='+queryData),
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
        auth: {
            username: 'root',
            password: 'root'
        }
    };



    return request(options, function (err, res, body) {
        return body;
    })






}

module.exports = {
    getNodesData : getNodesData
};