/**
 * Created by soroush on 4/4/17.
 */
angular.module('techDirectives', [])

    .directive('graphView', function () {

        return {
            link : d3Draw,
            controller : function ($scope) {
                this.sendNodeData = function (title, nodes, links) {
                    $scope.$emit("nodeDoubleClick",[title, nodes, links]);
                };
                $scope.$on("weightToggle", function () {
                    $scope.weightToggleD3();
                })
            },
            restrict : 'E',
            scope : {
                d3Nodes : '=',
                d3Links : '='
            }
        };


        function d3Draw(scope, element, attr, ctrl) {


            scope.$watchGroup(['d3Links', 'd3Nodes'], function (newValues) {

                d3.select('svg').remove();
                var height = $(window).height()*0.7,
                    width = $('.graphWindow').width() ;

                var myChart = d3.select(element[0]).append('svg')
                    .style("width", width)
                    .style("height", height)
                    .style("background", "white")
                    .attr('class', 'mainSvg')
                ;
                var nodes = newValues[1], links = newValues[0]
                ;


                myChart = myChart.call(d3.zoom().on("zoom", zoomed)).on("dblclick.zoom", null).append("g");


                var color = d3.scaleOrdinal(d3.schemeCategory10),
                    linkText
                ;
                /*            var toolTip = d3.select('body').append('div')
                 .style('position', 'absolute')
                 .style('padding', '5px 10px')
                 .style('background', '#303030')
                 .style('color', 'white')
                 .style('display', 'none')
                 .style('border-radius', '5px')
                 ;*/

                d3.select(element[0]).append('div')
                    .style('position', 'absolute')
                    .style('padding', '5px 10px')
                    .style('color', 'black')
                    .style('left', '0')
                    .style('top', '5px')
                    .html('<p><span>Person : </span><i class="fa fa-user-o" aria-hidden="true"></i></p>' +
                        '<p><span>Technology : </span><i style="color : black" class="fa fa-circle" aria-hidden="true"></i></p>')
                ;
                myChart
                    .append("svg:defs").selectAll("marker")
                    .data(["end"])      // Different link/path types can be defined here
                    .enter().append("svg:marker")    // This section adds in the arrows
                    .attr("id", String)
                    .attr("viewBox", "0 -5 10 10")
                    .attr("refX", 120+"px")
                    .attr("refY", 0)
                    .attr("markerWidth", 85)
                    .attr("markerHeight", 80)
                    .attr("orient", "auto")
                    .append("svg:path")
                    .attr("d", "M0,-5L10,0L0,5");



                var simulation = d3.forceSimulation(nodes)
                    .force("link", d3.forceLink().id(function (d) {
                        return d.id
                    })
                        .distance(function (d) {

                            return (1/d.value) * 100
                        }))
                    .force("charge", d3.forceManyBody().strength(-1000))
                    .force("center", d3.forceCenter(width / 2, height / 2))
                    .on("tick", ticked)
                ;

                simulation
                    .nodes(nodes)
                ;

                simulation.force("link")
                    .links(links)
                ;

                var link = myChart.selectAll(".link")
                    .data(links)
                    .enter().append("line")
                    .attr("class", "link")
                    .attr("stroke", "#333")

                    .style("stroke-width", function(d) {
                        return   0.1  ;
                    })
                    .attr("marker-end", "url(#end)");




                var node = myChart.selectAll("g")
                    .data(nodes)
                    .enter().append("g")
                    .attr("class", function(d) {
                        return d["icon"];
                    })
                    .call(d3.drag()
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended)

                    )

                ;

                d3.selectAll(".person")
                    .append('text')
                    .attr('font-family', 'FontAwesome')
                    .text(function() { return '\uf2c0' })
                    .style('cursor', 'pointer');


                d3.selectAll(".tech")
                    .append("circle")
                    .attr("r", 10)
                    .attr("fill", function (d, i) {
                        if (!(d["cluster"]))
                            return color(i);
                        else
                            return color(d["cluster"]);
                    })
                    .style('cursor', 'pointer');





                node.append("text")
                    .attr("dx", 27)
                    .attr("dy", ".25em")
                    .text(function(d) { return d.title });


                node.on('mouseover', function (d) {
                    /*                 toolTip.transition()
                     .style('display', 'block');

                     toolTip
                     .html('<h5 class="nodeToolTip">'+d.title+'</h5>'+'<h6 class="nodeToolTipEdges">Node edges : '+d.edgeCount+'</h6>')
                     .style('left', (d3.event.pageX +20) + 'px')
                     .style('top', d3.event.pageY + 10+ 'px');
                     */
                    d3.select("#nodeName").html(d.title);

                });

                node.on('dblclick', function (d) {

                    ctrl.sendNodeData(d.title, nodes, links);
                });


                node.on('click', connectedNodes); //Added code


                /*        .on("mouseout", function() {
                 toolTip.transition()
                 .style('display', 'none');

                 })*/
//Toggle stores whether the highlighting is on
                var toggle = 0;
//Create an array logging what is connected to what
                var linkedByIndex = {};
                for (var i = 0; i < nodes.length; i++) {
                    linkedByIndex[i + "," + i] = 1;
                }

                links.forEach(function (d) {
                    linkedByIndex[d.source.index + "," + d.target.index] = 1;
                });

//This function looks up whether a pair are neighbours
                function neighboring(a, b) {
                    return linkedByIndex[a.index + "," + b.index];
                }
                function connectedNodes() {
                    if (toggle == 0) {
                        //Reduce the opacity of all but the neighbouring nodes
                        var d = d3.select(this).node().__data__;
                        node.style("opacity", function (o) {
                            return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
                        });
                        link.style("opacity", function (o) {
                            return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
                        });
                        linkText.style("opacity", function (o) {
                            return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
                        })
                        d3.select(this).select("circle")
                            .transition("200")
                            .attr("r", 25)
                        ;
                        d3.select(this).selectAll("text")
                            .transition("200")
                            .style("font-size", 34+"px")
                        ;
                        //Reduce the op
                        toggle = 1;
                    } else {
                        //Put them back to opacity=1
                        node.style("opacity", 1);
                        link.style("opacity", 1);
                        linkText.style("opacity", 1);
                        d3.selectAll("circle")
                            .transition("200")
                            .attr("r", 10)
                        ;
                        d3.select(this).selectAll("text")
                            .transition("200")
                            .style("font-size", 19+"px")
                        ;
                        toggle = 0;
                    }
                }


                // Append text to Link edges
                linkText = myChart.selectAll(".Link")
                    .data(links)
                    .enter()
                    .append("text")
                    .attr("class", "weight")
                    .classed("displayWeight", true)
                    .attr("font-family", "Arial, Helvetica, sans-serif")
                    .attr("fill", "Black")
                    .style("font", "normal 12px Arial")
                    .attr("dy", ".35em")
                    .text(function (d) {
                        return d.value;
                    });

                scope.weightToggleD3 = function() {
                    linkText.classed("displayWeight", !linkText.classed("displayWeight"));
                };


                function ticked() {
                    link
                        .attr("x1", function (d) {
                            return d.source.x;
                        })
                        .attr("y1", function (d) {
                            return d.source.y;
                        })
                        .attr("x2", function (d) {
                            return d.target.x;
                        })
                        .attr("y2", function (d) {
                            return d.target.y;
                        });



                    node.attr("transform", function(d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    });
                    /*                node
                     .attr("cx", function (d) {
                     return d.x;
                     })
                     .attr("cy", function (d) {
                     return d.y;
                     });*/


                    linkText
                        .attr("x", function(d) {
                            if (d.target.x > d.source.x) {
                                return (d.source.x + (d.target.x - d.source.x)/2); }
                            else {
                                return (d.target.x + (d.source.x - d.target.x)/2); }
                        })
                        .attr("y", function(d) {
                            if (d.target.y > d.source.y) {
                                return (d.source.y + (d.target.y - d.source.y)/2); }
                            else {
                                return (d.target.y + (d.source.y - d.target.y)/2); }
                        })

                }

                function dragstarted(d) {
                    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                }

                function dragged(d) {
                    d.fx = d3.event.x;
                    d.fy = d3.event.y;
                }

                function dragended(d) {
                    if (!d3.event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;

                }
                function zoomed() {
                    myChart.attr("transform", "translate(" + d3.event.transform.x + "," + d3.event.transform.y + ")" + " scale(" + d3.event.transform.k + ")");
                }

            });
        }

    });