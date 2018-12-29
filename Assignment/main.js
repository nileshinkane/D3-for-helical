d3.select("body")
    .style("font-family","Roboto");

d3.select("body")
    .append("h1")
    .text("Helical IT popularity among Interns and number of projects each month")
    .style("text-align","center")
    .style("color","#791E94");  

var default_height = 500,
    default_width = 960,
    default_ratio = default_width/default_height;
// set the dimensions of the canvas
var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = default_width - margin.left - margin.right,
    height = default_height - margin.top - margin.bottom;
    


function set_vars() {
    
    var current_width = window.innerWidth,
    current_height = window.innerHeight,
    current_ratio = current_width/current_height;
    
    if(current_ratio > default_ratio) {
        var h = current_height;
        var w = h*default_ratio;
    } else {
        var w = current_width;
         h = w/default_ratio;
    }
    
     // Set new width and height based on graph dimensions
  width = w - margin.left - margin.right;
  height = h - margin.top - margin.bottom;
    
};

set_vars();






// This is the tool tip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

//Loading the data here
function drawGraphic() {
    
// setting the ranges here
var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

var y1 = d3.scale.linear().range([height, 0]);
var y2 = d3.scale.linear().range([height, 0]);


// Making the axis here
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");


var y1Axis = d3.svg.axis()
    .scale(y1)
    .orient("left");

var y2Axis = d3.svg.axis()
    .scale(y2)
    .orient("right");


// adding the SVG element here
var svg = d3.select("body").append("svg").style("margin","0 auto")
 .attr("width", width + margin.left + margin.right)
 .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

    
    //Retrieving data 
d3.json("data/data.json", function(err, data) {
   
    // Retrieving Keys here
   var getKeys = function(arr) {
       var key, keys=[];
       for(var i=0; i< (arr.length - (arr.length - 1)); i++) {
           for(key in arr[i]) {
               keys.push(key);
           }
       }
       return keys;
   }
   var myKeys = getKeys(data);
   // console.log(myKeys);  // This returns an array     ["Interns","Projects","Time"]
    
    
    
    
//function getFields(input, field) {
//    var y1data = [];
//    for (var i=0; i < input.length; i++) {
//        if(!isNaN(input[i][field])) {
//            y1data.push(input[i][field]);
//        }
//    }
//    return y1data;
//}var result = getFields(data, myKeys[0]);
//    console.log(result);
// console.log()

    
    
     // scale the range of the data
    x.domain(data.map(function(d) { return d[myKeys[2]]; }));
    y1.domain([0, d3.max(data, function(d) { return d[myKeys[0]]; })]);
    y2.domain([0, d3.max(data, function(d) { return d[myKeys[1]]; })]);
    
 // add axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)");
    
    svg.append("g")
      .call(y1Axis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("dy", ".71em")
    .attr("dx", "-.8em")
      .style("text-anchor", "end")
      .text("Percentage");
    
     svg.append("g")
        .attr("transform", "translate("+ width +",0)")
      .call(y2Axis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dy", "-.8em")
      .attr("transform", "rotate(-90)" );
    
   //Adding the Bars here
    svg.selectAll(".bar1")
        .data(data)
        .enter().append('rect')
        .style("fill","pink")
        .attr("x", function(d){ return x(d[myKeys[2]]); } )
        .attr("width", x.rangeBand()/4)
        .attr("y", function(d) { return y1(d[myKeys[0]]);})
        .attr("height", function(d) {return height - y1(d[myKeys[0]])})
        .on("mouseover", function(d){
            div.transition()
                .duration(200)
                .style("opacity", 0.9);
            div.html(d[myKeys[0]] +"%" + "<br/>" + d[myKeys[2]])
                .style("left", (d3.event.pageX)+ "px")
                .style("top", (d3.event.pageY) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });
    
    svg.selectAll(".bar2")
        .data(data)
        .enter().append('rect')
        .style("fill","black")
        .attr("transform", "translate("+ (x.rangeBand()/4) +",0)")
        .attr("x", function(d){ return x(d[myKeys[2]]); } )
        .attr("width", x.rangeBand()/4)
        .attr("y", function(d) { return y2(d[myKeys[1]]);})
        .attr("height", function(d) {return height - y2(d[myKeys[1]])})
        .on("mouseover", function(d){
            div.transition()
                .duration(200)
                .style("opacity", 0.9);
            div.html(d[myKeys[1]] + "Projects" + "<br/>" + d[myKeys[2]])
                .style("left", (d3.event.pageX)+ "px")
                .style("top", (d3.event.pageY) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });
        
});
};
drawGraphic();
var resizeTimer;
window.onresize = function(event) {
 clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function()
  {
    var s = d3.selectAll('svg');
    s = s.remove();
    set_vars();
    drawGraphic();
  });
}