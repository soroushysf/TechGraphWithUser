/**
 * Created by soroush on 7/15/17.
 */

function getNodesTitles(inputString, request) {

    var options = {
        url:  encodeURI('http://localhost:2480/query/tech_graph/sql/select from techs where tech_title like "'+inputString+'%"'),
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
        return res;
    })
}

module.exports = {
    getNodesTitles : getNodesTitles
};