define([
    "text!templates/Dashboard/DashboardTemplate.html",
	"d3",
	"common"
],
       function (DashboardTemplate, d3, common) {
		   var ContentView = Backbone.View.extend({
			   contentType: "Dashboard",
			   actionType: "Content",
               template: _.template(DashboardTemplate),
               el: '#content-holder',
               initialize: function () {
                   this.dateRange = 30;
                   this.dateRangeSource = 30;
                   this.dateItem = "D";
				   this.numberToDate = {};
                   this.render();
               },
               events: {
                   "click .choseDateRange .item": "newRange",
                   "click .choseDateRangeSource .item": "newRangeSource",
                   "click .choseDateItem .item": "newItem",
				   'click .chart-tabs a': 'changeTab',
               },
			   changeTab:function(e){
				   $(e.target).closest(".chart-tabs").find("a.active").removeClass("active");
				   $(e.target).addClass("active");
				   var n = $(e.target).parents(".chart-tabs").find("li").index($(e.target).parent());
				   $(".chart-tabs-items").find(".chart-tabs-item.active").removeClass("active");
				   $(".chart-tabs-items").find(".chart-tabs-item").eq(n).addClass("active");
			   },

               newRange: function (e) {
                   $(e.target).parent().find(".active").removeClass("active");
                   $(e.target).addClass("active");
                   this.dateRange = $(e.target).data("day");
                   this.renderPopulate();
               },
               newRangeSource: function (e) {
                   $(e.target).parent().find(".active").removeClass("active");
                   $(e.target).addClass("active");
                   this.dateRangeSource = $(e.target).data("day");
                   this.renderPopulateSource();
               },

               newItem: function (e) {
                   $(e.target).parent().find(".active").removeClass("active");
                   $(e.target).addClass("active");
                   this.dateItem = $(e.target).data("item");
                   this.renderPopulate();
               },
			   getDateFromDayOfYear:function(index){
				   return dateFormat(new Date(this.numberToDate[index]).toString('MMMM ,yyyy'),"mmmm dd, yyyy");
			   },
               getDay: function (index) {
                   switch (index) {
                   case 1: return "Monday";
                   case 2: return "Tuesday";
                   case 3: return "Wednesday";
                   case 4: return "Thursday";
                   case 5: return "Friday";
                   case 6: return "Saturday";
                   case 7: return "Sunday";
                   }
               },
               getMonth: function (index) {
                   switch (index) {
                   case 1: return "January";
                   case 2: return "February";
                   case 3: return "March";
                   case 4: return "April";
                   case 5: return "May";
                   case 6: return "June";
                   case 7: return "July";
                   case 8: return "August";
                   case 9: return "September";
                   case 10: return "October";
                   case 11: return "November";
                   case 12: return "December";


                   }
               },

               render: function () {
                   this.$el.html(this.template());
                   this.renderPopulate();
                   this.renderPopulateSource();
               },
               renderPopulateSource: function () {
                   var self = this;
                   $(".chart").empty();
                   common.getLeadsForChart(true, this.dateRangeSource, this.dateItem, function (data) {
                       var margin = { top: 20, right: 160, bottom: 30, left: 160 },
					   width = $(document).width() - margin.left - margin.right,
					   height = 600 - margin.top - margin.bottom;

                       var y = d3.scale.ordinal()
						   .rangeRoundBands([0, height], .3);

                       var x = d3.scale.linear()
						   .range([width, 0]);

                       var x2 = d3.scale.linear()
						   .range([0, width]);

                       var xAxis = d3.svg.axis()
						   .scale(x2)
						   .orient("bottom");

                       var yAxis = d3.svg.axis()
						   .scale(y)
						   .orient("left");

                       var chart = d3.select(".chart")
						   .attr("width", width + margin.left + margin.right)
						   .attr("height", height + margin.top + margin.bottom)
						   .append("g")
						   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                       y.domain(data.map(function (d) { return d.source; }));
                       x.domain([0, d3.max(data, function (d) { return d.count; })]);
                       x2.domain([0, d3.max(data, function (d) { return d.count; })]);

                       chart.append("g")
						   .attr("class", "x axis")
						   .attr("transform", "translate(0," + height + ")")
						   .call(xAxis);

                       chart.append("g")
						   .attr("class", "y axis")
						   .call(yAxis);
                       data1 = _.filter(data, function (item) {
                           return item.isOpp;
                       });
                       data2 = _.filter(data, function (item) {
                           return !item.isOpp;
                       });
                       for (var i = 0; i < data1.length; i++) {
                           for (var j = 0; j < data1.length; j++) {
                               if (data1[i].source == data2[j].source) {
                                   data1[i].value += data2[j].value;
                                   break;
                               }
                           }
                       }
                       chart.selectAll(".bar2")
						   .data(data2)
						   .enter().append("rect")
						   .attr("class", "bar2")
						   .attr("x", function (d) { return 0 })
						   .attr("y", function (d) { return y(d.source); })
						   .attr("height", y.rangeBand())
						   .attr("width", function (d) { return width - x(d.count); });

                       chart.selectAll(".bar")
						   .data(data1)
						   .enter().append("rect")
						   .attr("class", "bar")
						   .attr("x", function (d) { return 0 })
						   .attr("y", function (d) { return y(d.source); })
						   .attr("height", y.rangeBand())
						   .attr("width", function (d) { return width - x(d.count); });

                       chart.selectAll(".x .tick line")
						   .data(data)
						   .attr("y2", function (d) { return -height })
                       function type(d) {
                           d.count = +d.count; // coerce to number
                           return d;

                       }

                   });
               },
               renderPopulate: function () {
                   var self = this;
                   $(".leadChart").empty();
                   common.getLeadsForChart(null, this.dateRange, this.dateItem, function (data) {
                       console.log(data);
                       var margin = { top: 20, right: 160, bottom: 190, left: 160 },
					   width = $(document).width() - margin.left - margin.right,
					   height = 500 - margin.top - margin.bottom;
                       var x = d3.scale.ordinal()
						   .rangeRoundBands([0, width], .6);

                       var y = d3.scale.linear()
						   .range([height, 0]);

                       var y2 = d3.scale.linear()
						   .range([height, 0]);

                       var x2 = d3.scale.linear()
						   .range([0, width]);

                       var xAxis = d3.svg.axis()
						   .scale(x)
						   .orient("bottom")
						   .tickFormat(function (d) {
						       switch (self.dateItem) {
						       case "DW": return self.getDay(d);
						       case "M": return self.getMonth(d);
						       case "D":return self.getDateFromDayOfYear(d);
							   }
							   return d;

						   });

                       var yAxis = d3.svg.axis()
						   .scale(y)
						   .orient("left");

                       var yAxis2 = d3.svg.axis()
						   .scale(y2)
						   .orient("right")
						   .tickFormat(function (d) {
						       return d + "%"
						   });
                       var chart = d3.select(".leadChart")
						   .attr("width", width + margin.left + margin.right)
						   .attr("height", height + margin.top + margin.bottom)
						   .append("g")
						   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                       var line = d3.svg.line()
						   .x(function (d) { return x(d.source) + x.rangeBand() / 2; })
						   .y(function (d) { return y(d.count); })
						   .interpolate("cardinal");
//                       data.sort(function (a, b) { return d3.ascending(a.source, b.source); });
					   if(self.dateItem == "D"){
						   data = _.map(data, function(item){
							   item.source = item.source+item.year*10000;
							   return item;
						   });
					   }
					   data.forEach(function(item){
						   self.numberToDate[item.source] = item.date[0]
					   });
					   
                       data1 = _.filter(data, function (item) {
                           return item.isOpp;
                       });
                       data2 = _.filter(data, function (item) {
                           return !item.isOpp;
                       });

                       var percent = [];

                       c1 = data1;
                       c2 = data2;
                       var isChanged = false;
                       if (data1.length < data2.length) {
                           c1 = data2;
                           c2 = data1;
                           isChanged = true;
                       }
                       for (var i = 0; i < c1.length; i++) {
                           var b = false;
                           for (var j = 0; j < c2.length; j++) {
                               if (c1[i].source == c2[j].source) {
                                   if (isChanged) {
                                       if (c1[i].count || c2[j].count) {
                                           percent.push({ source: c1[i].source, count: c2[j].count / (c1[i].count + c2[j].count) });
                                       } else {
                                           percent.push({ source: c1[i].source, count: 0 });
                                       }

                                   }
                                   else {
                                       if (c2[j].count || c1[i].count) {
                                           percent.push({ source: c1[i].source, count: c1[i].count / (c1[i].count + c2[j].count) });
                                       } else {
                                           percent.push({ source: c1[i].source, count: 0 });
                                       }
                                   }

                                   b = true;
                                   break;
                               }
                           }
                           if (!b) {
                               percent.push({ source: c1[i].source, count: 0 });
                           }
                       }

                       var maxval = d3.max(data, function (d) { return d.count; });
                       for (var i = 0; i < data1.length; i++) {
                           for (var j = 0; j < data2.length; j++) {
                               if (data1[i].source == data2[j].source) {
                                   data1[i].count += data2[j].count;
                                   break;
                               }
                           }
                       }

                       var maxval3 = d3.max(percent, function (d) { return d.count; });
                       var minval3 = d3.min(percent, function (d) { return d.count; });

                       var scale = 0.9;
                       var maxval = d3.max(data, function (d) { return d.count; }) * scale;
                       var minval2 = d3.min(percent, function (d) { return d.count; }) * scale;
                       percent = _.map(percent, function (item) {
                           item.count = (item.count - minval2)
                           return item;

                       });


					   var maxval2 = d3.max(percent, function (d) { return d.count; });		
                       if (maxval2==0)maxval2=1;															
                       percent = _.map(percent, function (item) {
                           item.count = (item.count) * maxval / maxval2;
                           return item;

                       });
                       x.domain(data.map(function (d) { return d.source; }));
                       y.domain([0, d3.max(data, function (d) { return d.count; })]);
                       y2.domain([minval3 * 100, maxval3 * 100]);
                       x2.domain([0, d3.max(data, function (d) { return d.count; })]);
					   if(self.dateItem != "D"){
						   chart.append("g")
							   .attr("class", "x axis")
							   .attr("transform", "translate(0," + height + ")")
							   .call(xAxis)
							   .selectAll("text")

					   }else{
					   if (self.dateRange=="7"){
						   chart.append("g")
							   .attr("class", "x axis")
							   .attr("transform", "translate(0," + height + ")")
							   .call(xAxis)
							   .selectAll("text")
					   }
					   if (self.dateRange=="30"){
						   chart.append("g")
							   .attr("class", "x axis")
							   .attr("transform", "translate(0," + height + ")")
							   .call(xAxis)
							   .selectAll("text")
							   .attr("transform","rotate(-60)")
							   .attr("x", "-10")
							   .attr("y", "2")
							   .attr("style", "text-anchor:end;")
					   }
					   if (self.dateRange=="90"){
						   chart.append("g")
							   .attr("class", "x axis")
							   .attr("transform", "translate(0," + height + ")")
							   .call(xAxis)
							   .selectAll("text")
							   .attr("transform","rotate(-60)")
							   .attr("x", function(d,i){
								   if (i%2!=0){
									   return 1000;
								   }
								   return -10;
							   })
							   .attr("data-id", function(){
								   return this.getComputedTextLength();
							   })
							   .attr("style", "text-anchor:end;")
							   .attr("y", "2")
					   }
					   if (self.dateRange=="365"){
						   chart.append("g")
							   .attr("class", "x axis")
							   .attr("transform", "translate(0," + height + ")")
							   .call(xAxis)
							   .selectAll("text")
							   .attr("transform","rotate(-90)")
							   .attr("x", function(d,i){
								   if (i%5!=0){
									   return 1000;
								   }
								   return -10;
							   })
							   .attr("y", "2")
							   .attr("style", "text-anchor:end;")
					   }
					   }

                       chart.append("g")
						   .attr("class", "y axis")
						   .call(yAxis)
						   .selectAll(".tick line")
						   .attr("x2", function (d) { return width })
						   .style("fill", "#1EBBEA")


                       chart.append("g")
						   .attr("class", "y2 axis")
						   .attr("transform", "translate(" + width + ",0)")
						   .call(yAxis2)


                       chart.selectAll(".bar")
						   .data(data1)
						   .enter().append("rect")
						   .attr("class", "bar")
						   .attr("x", function (d) { return x(d.source); })
						   .attr("y", function (d) { return y(d.count); })
						   .attr("height", function (d) { return height - y(d.count); })
						   .attr("width", x.rangeBand());

                       chart.selectAll(".bar2")
						   .data(data2)
						   .enter().append("rect")
						   .attr("class", "bar2")
						   .attr("x", function (d) { return x(d.source); })
						   .attr("y", function (d) { return y(d.count); })
						   .attr("height", function (d) { return height - y(d.count); })
						   .attr("width", x.rangeBand());

                       chart.selectAll(".bar3")
						   .data(data2)
						   .enter().append("rect")
						   .attr("class", "bar3")
						   .attr("x", function (d) { return x(d.source); })
						   .attr("y", function (d) { return y(d.count); })
						   .attr("height", function (d) { return 2; })
						   .attr("width", x.rangeBand());

                       chart.append("path")
						   .datum(percent)
						   .attr("class", "line")
						   .attr("d", line);

                       chart.selectAll(".circle")
						   .data(percent)
						   .enter().append("circle")
						   .attr("class", "circle")
						   .attr("cx", function (d) { return x(d.source) + x.rangeBand() / 2; })
						   .attr("cy", function (d) { return y(d.count); })
						   .attr("r", function (d) { return 4; })
						   .style("fill", "#1EBBEA")
						   .style("stroke", "#fff")
						   .style("stroke-width", "2");

                       chart.append("text")
						   .attr("class", "y label")
						   .attr("text-anchor", "end")
						   .attr("y", -65)
						   .attr("x", -height / 2 + 80)
						   .attr("dy", ".75em")
						   .attr("transform", "rotate(-90)")
						   .text("Number of Leads");

                       chart.append("text")
						   .attr("class", "y2 label")
						   .attr("text-anchor", "end")
						   .attr("y", -width - 75)
						   .attr("x", height / 2 + 120)
						   .attr("dy", ".75em")
						   .attr("transform", "rotate(90)")
						   .text("Opportunity Conversion Rate");
                       function type(d) {
                           d.count = +d.count; // coerce to number
                           return d;

                       }
                   });

               }
           });
           return ContentView;
       });
