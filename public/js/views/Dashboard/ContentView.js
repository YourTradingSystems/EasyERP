define([
    "text!templates/Dashboard/DashboardTemplate.html",
	"d3",
	"common"
],
       function (DashboardTemplate,d3,common) {
           var ContentView = Backbone.View.extend({
               el: '#content-holder',
               contentType: "Dashboard",
               actionType:"Content",
               template: _.template(DashboardTemplate),
               initialize: function () {
                   this.render();
               },
               events:{

               },

               render: function () {
                   this.$el.html(this.template());
				   common.getLeadsForChart(function(dataM){
				   var parseDate = d3.time.format("%b.%y").parse,
				   formatYear = d3.format("02d"),
				   formatDate = function (d) { return "M" + d; };

				   var margin = { top: 10, right: 50, bottom: 20, left: 50},
				   width = $(document).width() - margin.left - margin.right,
				   height = 500 - margin.top - margin.bottom;

				   var y0 = d3.scale.ordinal()
					   .rangeRoundBands([height, 0], .2);

				   var y1 = d3.scale.linear();

				   var y2 = d3.scale.linear();
				   var y3 = d3.scale.linear();

				   var x = d3.scale.ordinal()
					   .rangeRoundBands([0, width], .5, 0);
				   var xAxis = d3.svg.axis()
					   .scale(x)
					   .orient("bottom")
					   .tickFormat(formatDate);

				   var stack = d3.layout.stack()
					   .values(function (d) { return d.values; })
					   .x(function (d) { return d.date; })
					   .y(function (d) { return d.count; })
					   .out(function (d, y0) { console.log(y0);d.valueOffset = y0; });

				   var color = d3.scale.ordinal()



				   var svg = d3.select("#leadChart").append("svg")
					   .attr("width", width + margin.left + margin.right)
					   .attr("height", height + margin.top + margin.bottom)
					   .append("g")
					   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
					   
					   data2=[

					   {
						   key:"Converted to Opp",
						   values:_.map(
								   _.filter(dataM,function(item){
									   return item._id.isOpportunitie;
								   }),
							   function(item){
								   var c={}
								   c["value"]=item.count;
								   c["date"]=item._id.dateBy.toString();
								   return c;
							   }
						   )
					   },
					    {
						   key:"Opp",
						   values:_.map(
								   _.filter(dataM,function(item){
									   return item._id.isOpportunitie==false;
								   }),
							   function(item){
								   var c={}
								   c["value"]=item.count;
								   c["date"]=item._id.dateBy.toString();
								   return c;
							   }
						   )
					   }

];
					   dataByGroup=data2;
					   var sumarray = []
					   var procent = []
					   for (var i=0;i<dataByGroup[0].values.length;i++){
						   for (var j=0;j<dataByGroup[0].values.length;j++){
							   if (dataByGroup[0].values[i].date==dataByGroup[1].values[j].date){
								   sumarray.push({"date":dataByGroup[0].values[i].date,"value":dataByGroup[1].values[j].value+dataByGroup[0].values[i].value});
								   if (dataByGroup[1].values[j].value){
									   procent.push({data:dataByGroup[0].values[i].date,value:dataByGroup[0].values[i].value/dataByGroup[1].values[j].value})
								   }
								   else
									   procent.push({data:dataByGroup[0].values[i].date,value:0})
								   dataByGroup[0].values[i].value+=dataByGroup[1].values[j].value;
								   
							   }
						   }
					   }
					   console.log(procent);
					   console.log(dataByGroup);
var maxval = 0;
//    dataByGroup = dataByGroup.slice(1, dataByGroup.length);
    dataByGroup.forEach(function (d, i) {
//      d.values = d3.entries(d.values[0]).slice(2, d3.entries(d.values[0]).length);
      var tempmax = d3.max(d.values, function (dd) { return dd.value });
      if (maxval < tempmax) {
        maxval = +tempmax;
      }
      d.values.forEach(function (dd, i) {
        dd.group = d.key;
//        dd.value = +dd.value || 0;
      });
    });
					   stack(dataByGroup);
    y0.domain(sumarray.map(function (d, i) { return d.value; }));
    x.domain(dataByGroup[0].values.map(function (d) { return d.date; }));
    y1.domain([0, maxval]).range([y0.rangeBand(), 0]);
    y2.domain([0, maxval]).range([0, height - 20]);
    y3.domain([0, maxval]).range([height -20,0]);
      
    color
      .domain(y0.domain)
      .range(["#929993","#c28191","#6cade1","#ffec72","#828fc6","#e3c291"]);

    var group = svg.selectAll(".group")
        .data(dataByGroup)
      .enter().append("g")
        .attr("class", "group")
        .attr("transform", function (d) { return "translate(0," + y0(d.key) + ")"; });

    group.selectAll("rect")
        .data(function (d) { return d.values; })
      .enter().append("rect")
        .style("fill", function (d) { return color(d.group); })
        .attr("x", function (d) { return x(d.date); })
        .attr("y", function (d) { return y1(d.value); })
        .attr("width", x.rangeBand())
        .attr("height", function (d) { return y0.rangeBand() - y1(d.value); });

    var yAxis = d3.svg.axis()
        .scale(y3)
        .orient("left")
        .tickFormat(d3.format(".2s"));
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em");
 
    group.filter(function (d, i) { return !i; }).append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + y0.rangeBand() + ")")
        .call(xAxis);

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.data); })
    .y(function(d) { return y(d.value); })
//						   .interpolate("basis")

  x.domain(d3.extent(procent, function(d) { return d.data; }));
  y.domain(d3.extent(procent, function(d) { return d.value; }));
  svg.append("path")
      .datum(procent)
      .attr("class", "line")
      .attr("d", line);
    function transitionMultiples() {
      var t = svg.transition().duration(750),
          g = t.selectAll(".group").attr("transform", function (d) { return "translate(0," + y0(d.key) + ")"; });
      g.selectAll("rect")
        .attr("height", function (d) { return y0.rangeBand() - y1(d.value); })
        .attr("y", function (d) { return y1(d.value); });
      g.select(".group-label")
        .attr("y", function (d) { return y1(d.values[0].value / 2); })
        .attr("x", width);
    }

    function transitionStacked() {
      var t = svg.transition().duration(750),
          g = t.selectAll(".group").attr("transform", "translate(0," + y0(y0.domain()[0]) + ")");
      g.selectAll("rect")
          .attr("height", function (d) { return y2(d.value); })
          .attr("y", function (d) { return y2(-d.value)+23; });

    }
					   transitionStacked();
});
                   return this;
               }
           });

           return ContentView;
       });
