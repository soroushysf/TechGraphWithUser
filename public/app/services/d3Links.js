/**
 * Created by soroush on 4/4/17.
 */
angular.module('d3Services', [])
    .service('d3Link', function () {
        var d3Link = this;

        d3Link.createLink = function (linkData) {

            return linkData.map(function (link) {
                return {
                    'source' :  link.term_id1 ||  link["out"].replace(/#|:/g, '')  ,
                    'target' :  link.term_id2 ||  link["in"].replace(/#|:/g, '') ,
                    'value' : (Number(link["weighted_similarity"]) || link["weight"]).toFixed(3)
                };
            });
        };
        d3Link.filterLinkByTh = function (linkData, filterThreshHold) {
            filterThreshHold = typeof filterThreshHold !== 'undefined' ? filterThreshHold : 0.2;
            return linkData.filter(function (link) {
                return (link.value > filterThreshHold);
            });
        };
        // deletes edges that we have no nodes for them
        d3Link.filterLinks = function (links, nodes) {
            nodes = nodes.map(function (node) {
                return node.id;
            });
            return links.filter(function (link) {
                var checkLink = false;
                if(nodes.indexOf(link.source) !== -1 && nodes.indexOf(link.target) !== -1) {
                    checkLink = true;
                }
                return checkLink;
            });
        };
        d3Link.createLinkDoubleCLick = function (linkData) {
            return linkData.map(function (link) {
                return {
                    'source' :    link.source["id"]  ,
                    'target' :   link.target["id"] ,
                    'value' :  link["value"]
                };
            });
        };
    });
