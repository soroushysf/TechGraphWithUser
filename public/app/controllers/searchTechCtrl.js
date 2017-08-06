/**
 * Created by soroush on 4/5/17.
 */

angular.module('graphController')

.controller('searchTechController', function ($scope, graphData, $location, d3Node, d3Link) {

    $scope.inputs = [];
    $scope.itemValue = [];

    $scope.addField=function(techAdded){
        if($scope.inputs.length < 10) {
            $scope.inputs.push(techAdded)
        }
    };
    $scope.deleteField=function(){
        if( 0 < $scope.inputs.length) {
            $scope.inputs.splice(-1,1);
        }
    };
    $scope.techListNumber = 0;
    $scope.alphabetPicked = '';
    $scope.alphabetTechs = [];
    $scope.techWithAlphabet = function (alphabet) {
      $scope.alphabetPicked = alphabet;
        graphData.getNodeNames(alphabet)
            .then(function (data) {
                $scope.alphabetTechs = data.data.data.result;
            })
            .catch(function (data) {
                console.log(data);
            })
    };
    $scope.pickTech = function (techPicked) {
        var addTech = true;
        $scope.inputs.forEach(function (nodes) {
           if(nodes.tech_title === techPicked.tech_title){
               addTech = false;
           }
        });
        if(addTech) {
            $scope.addField(techPicked);
        }
    };
    $scope.searchGraph = function (view) {
        graphData.setThreshHold($scope.threshHold);

        var sendingData =  {
            nodeNames : $scope.inputs.map(function (el) {
                return JSON.stringify(el.tech_title);
            }),
            traverseDepth : typeof $scope.traverseDepth !== 'undefined' ? $scope.traverseDepth * 2 : 1,
            threshHold : $scope.threshHold
        };
        graphData.httpRequest('/nodeNames', sendingData)
            .then(function (result) {
                var finalData = {};
                finalData.links = d3Link.createLink(result["associations"]);
                finalData.nodes = d3Node.filterNodes(d3Node.createNode(result["techs"]), finalData.links);
                finalData.links = d3Link.filterLinks(finalData.links, finalData.nodes);

                finalData.searchedTechNames = $scope.itemValue;

                //send data to second page controller by main controller
                $location.path(view);
                $scope.$emit('searchedGraphData', finalData);


            });
    };

    $scope.alphabetArray = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
});