function processChart(whatever, Sprint, SprintArr)		{
		  
  function setupChart(Sprint, SprintArr, BurnDown, DaysorDates){
	  var SprintStart;
	  var SprintEnd;
	  
	  //Remove Prior Run
	  $('svg').remove();
	  $('#buttonControls').remove();
	  $('#buttonStateContainer').remove();
	  $('#buttonToggleContainer').remove();
	  $('#buttonToggleDaysorDatesContainer').remove();
	  
	  var BurnDownText;
	  var BundDownCommand;
	  if (BurnDown)
		  {
			BurnDownText="BurnDown Chart vs";
			BurnDownCommand="BurnUp";
			}
	  else
			{
			BurnDownText="BurnUp Chart vs";
			BurnDownCommand="BurnDown";
			}
		
	  var DaysorDatesText;
	  var DaysorDatesCommand;
	  if (DaysorDates)
		  {
			DaysorDatesText="Days";
			DaysorDatesCommand="Dates";
			}
	  else
			{
			DaysorDatesText="Dates";
			DaysorDatesCommand="Days";
		}	
		
		dropDown.on("click", onSprintButtonsClick);
		
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
					
		tr.append("th")
			.classed("ctrlth", true)
			.html(DaysorDatesText);	
			
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
		
		var td=tr.append("td")
			.classed("ctrltd", true);
			
		td.append("button")
			.attr("id","btnToggleDaysorDates")
			.attr("title", "Day/Date Toggle")
			.html(DaysorDatesCommand)
			.on("click", onToggleDaysorDatesClick);
	  
		var whateverSprint=dimple.filterData(whatever, "sprint", Sprint);	
		
		var svg = dimple.newSvg("#dimpleChartContainer");
		var myChart = new dimple.chart(svg, whateverSprint);
		myChart.setBounds(100,50,600,430);
	 
				
		// Add your x axis - nothing unusual here
		if (DaysorDates){
			var x = myChart.addCategoryAxis("x", "Day");
			x.addOrderRule("Day");
		}
		else 
		{
		  var x = myChart.addCategoryAxis("x", "Sprint Day");
		  x.addOrderRule("Sprint Day");
		}
				
		 // y axis changes for burndown and burnup
		  if (BurnDown)
		  {
			var y = myChart.addMeasureAxis("y", "Remaining Hours");
		  }
		  else 
		  {
			var y = myChart.addMeasureAxis("y", "Burned Hours Accumulator");
		  }				  			      
					  
		  y.showGridlines = true;
		  x.showGridlines = true;      

		 var lines = myChart.addSeries("runcycle", dimple.plot.line, [x,y]);

			// Do a bit of styling to make it look nicer
		lines.lineMarkers = true;
		lines.lineWeight = 3;
	 
		var myLegend = myChart.addLegend(640, 50, 60, 100);
		
		myChart.draw();
			
		function onSprintButtonsClick() {
			setupChart(d3.event.target.value,SprintArr, BurnDown, DaysorDates);
			};

		function onToggleBurnDownClick(e) {
			if (BurnDown)
			{
				BurnDown=0;
				}
			else
			{
				BurnDown=1;
				}
			setupChart(Sprint,SprintArr, BurnDown, DaysorDates);					
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
			setupChart(Sprint,SprintArr, BurnDown, DaysorDates);
		};			
		
	};
			 		
		setupChart(Sprint,SprintArr, 1, 1);
	 
};
      

function getListItems(listName, siteurl, success, failure) {
    $.ajax({
        url: siteurl + "/_api/web/lists/getbytitle('" + listName + "')/items",
        method: "GET",
        dataType: "json",
        headers: {
            "Accept": "application/json; odata=verbose"
        },
        success: function(data) {
            success(data);
        },
        error: function(data) {
            failure(data);
        }
    });
}



function getResourceData(Sprint) {

    var listName = "SprintDaysDemo";
    var SiteUrl = _spPageContextInfo.webAbsoluteUrl;

    getListItems(listName, SiteUrl, function(data) {

        var myData = [];
        var items = data.d.results;
        var TempHold = "";
        var SprintDay = "";
        var SprintStart = "";
        var SprintEnd = "";
        var SprintEndInd;


        //console.log(items);

        var obj;
        // Add all the new items
        for (var i = 0; i < items.length; i++) {
            TempHold = items[i].sprintday;
            SprintDay = TempHold.substr(0, 10);
            TempHold = items[i].sprintstart;
            SprintStart = TempHold.substr(0, 10);
            TempHold = items[i].sprintend;
            SprintEnd = TempHold.substr(0, 10);
            SprintEndInd = items[i].SprintEndInd;


            // Need to create two objects -- One for Prod - one for avg
            // Also need to include BurnUpAccs

            if (!SprintEndInd) {
                // obj 1 - Prod Record
                obj = {
                    "sprint": items[i].Title,
                    "Day": items[i].DayNbr,
                    "Sprint Day": SprintDay,
                    "sprintstart": SprintStart,
                    "sprintend": SprintEnd,
                    "sprinttotal": items[i].sprinttotal,
                    "Remaining Hours": items[i].remaininghours,
                    "burnedhours": items[i].burnedhours,
                    "Burned Hours Accumulator": items[i].burnedhoursacc,
                    "runcycle": "Prod"
                };
                myData.push(obj);
            }

            // obj 2 - Avg Record

            obj = {
                "sprint": items[i].Title,
                "Day": items[i].DayNbr,
                "Sprint Day": SprintDay,
                "sprintstart": SprintStart,
                "sprintend": SprintEnd,
                "sprinttotal": items[i].sprinttotal,
                "Remaining Hours": items[i].avgburndownremaininghours,
                "burnedhours": items[i].avgburndownhours,
                "Burned Hours Accumulator": items[i].avgburndownhoursacc,
                "runcycle": "Avg"
            };
            myData.push(obj);


        }
        console.log(myData);

        var SprintArr = dimple.getUniqueValues(myData, "sprint");
        console.log(SprintArr);

        var options = dropDown.selectAll("option")
            .data(SprintArr)
            .enter()
            .append("option");

        options.text(function(d) {
                return d;
            })
            .attr("value", function(d) {
                return d;
            });


        console.log(JSON.stringify(myData));

        if (Sprint == null) {

            processChart(myData, SprintArr[0], SprintArr);

        } else {
            processChart(myData, Sprint, SprintArr);

        }


    }, function(data) {
        alert("Ooops, an error occured. Please try again");

    });

};