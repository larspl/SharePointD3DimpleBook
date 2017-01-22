

function processChart(whatever)
		{
		  function setupChart(BurnDown){
			  var SprintStart;
			  var SprintEnd;
			  
			  //Remove Prior Run
			  $('svg').remove();
			  $('#buttonControls').remove();
			  $('#buttonToggleContainer').remove();
			
			  
			  var BurnDownText;
			  var BundDownCommand;
			  if (BurnDown)
				  {
					BurnDownText="Sprint Comparison by Day BurnDown Chart";
					BurnDownCommand="BurnUp";
					}
			  else
					{
					BurnDownText="Sprint Comparison by Day BurnUp Chart";
					BurnDownCommand="BurnDown";
					}
	
				//Setup Button for BurnDown Toggle
				var buttonToggleContainer=d3.select("#controlContainer")
					.append("div")
					.attr("id", "buttonToggleContainer");
				 var table1 = buttonToggleContainer.append('table')
							.attr("id","tblHeaders");
							
				var tr=table1.append("tr")	
						.attr("id","firstRow");
						
				tr.append("th")
					.classed("ctrlth", true)
					.html(BurnDownText);
					
				 table = buttonToggleContainer.append('table')
							.attr("id","tblCommands");	
				tr=table.append("tr")	
						.attr("id","secondRow");
						
				td=tr.append("td")
					.classed("ctrltd", true);
					
				td.append("button")
					.attr("id","btnToggleBurnDown")
					.attr("title", "BurnDown/BurnUp Toggle")
					.html(BurnDownCommand)
					.on("click", onToggleBurnDownClick);
		  
			   var svg = dimple.newSvg("#dimpleChartContainer");
				 

				whateverruncycle = dimple.filterData(whatever, "runcycle", ["Prod"])
				console.log(whateverruncycle);
				  	
			     var myChart = new dimple.chart(svg, whateverruncycle);
			     myChart.setBounds(100,50,600,430);
			 
			     // Add your x axis - nothing unusual here
			     var x = myChart.addCategoryAxis("x", "Day");
			     x.addOrderRule("Day");
				 						
				 // y axis changes for burndown and burnup
				  if (BurnDown)
				  {
					var y = myChart.addMeasureAxis("y", "Remaining Hours");
				  }
				  else {
					var y = myChart.addMeasureAxis("y", "Burned Hours Accumulator");
				  }				  			      
						      
				  y.showGridlines = true;
				  x.showGridlines = true;      
					      
					      
			     var lines = myChart.addSeries("sprint", dimple.plot.line, [x,y]);
				
		      		// Do a bit of styling to make it look nicer
				lines.lineMarkers = true;
				lines.lineWeight = 3;
			  
			  
		
			   var myLegend = myChart.addLegend(630, 50, 60, 100);
		      myChart.draw();
	
					
		       	function onToggleBurnDownClick(e) {
					if (BurnDown){
						BurnDown=0;
						}
					else {
						BurnDown=1;
						}
					setupChart(BurnDown);					
					};
						
				
			 };

			 setupChart(1);
	 
		};
      
  	function getResourceData(){
		   
		   processChart(myData);
				
				//console.log(myData);
				
		    
		
	};
	


	
