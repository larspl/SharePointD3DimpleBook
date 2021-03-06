﻿
var prodCycleListDiv;
var dropDown;
function processChart(whatever, ProdCycle, ProdCycleArr)		{

  function setupChart(ProdCycle, ProdCycleArr, RampUp, DaysorDates){
	 	  
	  //Remove Prior Run
	  $('svg').remove();
	  $('#buttonControls').remove();
	  $('#buttonToggleContainer').remove();
	  $('#buttonToggleDaysorDatesContainer').remove();
	  
	  var RampUpText;
	  var BundDownCommand;

	  if (RampUp)
		  {
			RampUpText="RampUp Chart vs.";
			RampUpCommand="BurnDown";
			}
	  else
			{
			RampUpText="BurnDown Chart vs.";
			RampUpCommand="RampUp";
			}
		
	  var DaysorDatesText;
	  var DaysorDatesCommand;
	  if (DaysorDates)
		  {
			DaysorDatesText="Day Nbr";
			DaysorDatesCommand="Dates";
			}
	  else
			{
			DaysorDatesText="Dates";
			DaysorDatesCommand="Day Nbr";
		}	
		
		dropDown.on("click", onProdCycleButtonsClick);
		
	   //Setup Button for RampUp Toggle
		var buttonToggleContainer=d3.select("#controlContainer")
			.append("div")
			.attr("id", "buttonToggleContainer");
		var table1 = buttonToggleContainer.append('table')
			.attr("id","tblHeaders");
					
		var tr=table1.append("tr")	
			.attr("id","firstRow");
				
		tr.append("th")
			.classed("ctrlth", true)
			.html(RampUpText);
					
		tr.append("th")
			.classed("ctrlth", true)
			.html(DaysorDatesText);	
			
		var table2 = buttonToggleContainer.append('table')
			.attr("id","tblCommands");	
		tr=table2.append("tr")	
			.attr("id","secondRow");
				
		td=tr.append("td")
			.classed("ctrltd", true);
			
		td.append("button")
			.attr("id","btnToggleRampUp")
			.attr("title", "RampUp/BurnDown Toggle")
			.html(RampUpCommand)
			.on("click", onToggleRampUpClick);
		
		var td=tr.append("td")
			.classed("ctrltd", true);
			
		td.append("button")
			.attr("id","btnToggleDaysorDates")
			.attr("title", "Day/Date Toggle")
			.html(DaysorDatesCommand)
			.on("click", onToggleDaysorDatesClick);
	  
		var whateverProdCycle=dimple.filterData(whatever, "Prod Cycle", ProdCycle);	
		
		var svg = dimple.newSvg("#dimpleChartContainer");
		var myChart = new dimple.chart(svg, whateverProdCycle);
		myChart.setBounds(100,50,600,430);
	 
				
		// Add your x axis - nothing unusual here
		if (DaysorDates){
			var x = myChart.addCategoryAxis("x", "Cycle Day Nbr");
			x.addOrderRule("Cycle Day Nbr");
		}
		else 
		{
		  var x = myChart.addCategoryAxis("x", "Cycle Day Date");
		  x.addOrderRule("Cycle Day Date");
		}
				
		 // y axis changes for burndown and burnup
		  if (RampUp)
		  {
			var y = myChart.addMeasureAxis("y", "Accumulated Units");
			
		  }
		  else 
		  {
			var y = myChart.addMeasureAxis("y", "Units Outstanding");
		  }				  			      
					  
		  y.showGridlines = true;
		  x.showGridlines = true;      

		 var lines = myChart.addSeries("Run Type", dimple.plot.line, [x,y]);

			// Do a bit of styling to make it look nicer
		lines.lineMarkers = true;
		lines.lineWeight = 3;
		myChart.defaultColors = [
			new dimple.color("#3498db", "#2980b9", 1), // blue
			new dimple.color("#2ecc71", "#27ae60", 1), // green
			// new dimple.color("#e74c3c", "#c0392b", 1), // red
		];
		var myLegend = myChart.addLegend(640, 50, 60, 100);
		
		myChart.draw();
			
		function onProdCycleButtonsClick() {
			setupChart(d3.event.target.value,ProdCycleArr, RampUp, DaysorDates);
			};

		function onToggleRampUpClick(e) {
			if (RampUp)
			{
				RampUp=0;
				}
			else
			{
				RampUp=1;
				}
			setupChart(ProdCycle,ProdCycleArr, RampUp, DaysorDates);					
			};
				
		function onToggleDaysorDatesClick(e) {
			if (DaysorDates)
			{
				DaysorDates=0;
				}
			else 
			{
				DaysorDates=1;
			}
			setupChart(ProdCycle,ProdCycleArr, RampUp, DaysorDates);
		};			
		
	};
			 		
	setupChart(ProdCycle,ProdCycleArr, 1, 1);
	 
};
      
      
  	function getResourceData(ProdCycle){
	   		
		var ProdCycleArr = dimple.getUniqueValues(myData, "Prod Cycle");
        console.log(ProdCycleArr);
		prodCycleListDiv=d3.select("#dimpleChartContainer")
					.append("div")
					.attr("id", "prodCycleHolder");
					
		dropDown = prodCycleListDiv
					.append("select")
					.attr("id", "prodCyclelist");
        var options = dropDown.selectAll("option")
            .data(ProdCycleArr)
            .enter()
            .append("option");
			
		options.text(function(d) {
			return d;
			})
			.attr("value", function(d) {
			return d;
		});

        console.log(JSON.stringify(myData));

        if (ProdCycle == null) {
            processChart(myData, ProdCycleArr[0], ProdCycleArr);
        } else {
            processChart(myData, ProdCycle, ProdCycleArr);
        }
				
		    
		
	};
	


	
