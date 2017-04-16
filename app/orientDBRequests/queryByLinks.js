/**
 * Created by soroush on 4/4/17.
 */

function getLinksData(queryData, threshHold,request) {

    var optionsLink;

    optionsLink = {
        url:  encodeURI('http://localhost:2480/query/tech_graph/sql/select from associations where (in = '+queryData+' or out = '+queryData+') and (weight > '+threshHold+') /1000'),
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
    getLinksData : getLinksData
};