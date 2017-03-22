function processChart(whatever) 
{
    function setupChart(RampUp) {
       
        //Remove Prior Run
        $('svg').remove();
        $('#buttonControls').remove();
        $('#buttonToggleContainer').remove();

        var RampUpText;
        var RampUpCommand;
         if (RampUp) 
		{
			RampUpText = "Production Cycle Comparison by Day RampUp Chart";
            RampUpCommand = "BurnDown";
			
        } 
		else 
		{
			RampUpText = "Production Cycle Comparison by Day BurnDown Chart";
            RampUpCommand = "RampUp";
        }

        //Setup Button for BurnDown Toggle
        var buttonToggleContainer = d3.select("#controlContainer")
            .append("div")
            .attr("id", "buttonToggleContainer");
        var table1 = buttonToggleContainer.append('table')
            .attr("id", "tblHeaders");

        var tr = table1.append("tr")
            .attr("id", "firstRow");

        tr.append("th")
            .classed("ctrlth", true)
            .html(RampUpText);

        var table2 = buttonToggleContainer.append('table')
            .attr("id", "tblCommands");
        tr = table2.append("tr")
            .attr("id", "secondRow");

        td = tr.append("td")
            .classed("ctrltd", true);

        td.append("button")
            .attr("id", "btnToggleRampUp")
            .attr("title", "RampUp/BurnDown Toggle")
            .html(RampUpCommand)
            .on("click", onToggleRampUpClick);


        whateverRunType = dimple.filterData(whatever, "Run Type", ["Prod"])
        console.log(whateverRunType);

        var svg = dimple.newSvg("#dimpleChartContainer");
        var myChart = new dimple.chart(svg, whateverRunType);
        myChart.setBounds(100, 50, 600, 430);

        // Add your x axis - nothing unusual here
        var x = myChart.addCategoryAxis("x", "Cycle Day Nbr");
        x.addOrderRule("Cycle Day Nbr");

        // y axis changes for rampup and burndown
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

        var lines = myChart.addSeries("Prod Cycle", dimple.plot.line, [x, y]);

        // Do a bit of styling to make it look nicer
        lines.lineMarkers = true;
        lines.lineWeight = 3;
		myChart.defaultColors = [
			  new dimple.color("#3498db", "#2980b9", 1), // blue
			  new dimple.color("#2ecc71", "#27ae60", 1)// green
			 // new dimple.color("#e74c3c", "#c0392b", 1); // red
				];
				
        var myLegend = myChart.addLegend(650, 50, 60, 800, "Right");
        myChart.draw();
     
        function onToggleRampUpClick(e) {
            if (RampUp) {
                RampUp = 0;
            } 
			else 
			{
                RampUp = 1;
            }
            setupChart(RampUp);
        };

    };

    setupChart(1);

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
};



function getResourceData() {

    var listName = "ProdDaysDemo";
    var SiteUrl = _spPageContextInfo.webAbsoluteUrl;

    getListItems(listName, SiteUrl, function(data) {

        var myData = [];
        var items = data.d.results;
        var TempHold = "";
        var ProdDay = "";
        var ProdEndInd;

        //console.log(items);

        var obj;
        // Add all the new items
        for (var i = 0; i < items.length; i++) {
            TempHold = items[i].ProdDay;
            ProdDay = TempHold.substr(0, 10);
            obj = {
                    "Prod Cycle": items[i].Title,
                    "Cycle Day Nbr": items[i].DayNbr,
                    "Cycle Day Date": ProdDay,
                    "Units Outstanding": items[i].UnitsOutstanding,
                    "Units Built": items[i].UnitsBuilt,
                    "Accumulated Units": items[i].AccumulatedUnits,
                    "Run Type": items[i].RunType,
                };
            myData.push(obj);
        }
        console.log(myData);
  
        processChart(myData);

},  function(xhr) {
				  alert( "The server has thrown an error. Please check console log for details!" );           
				  console.log( "Error: " + xhr.statusText );            
				  console.log( "Status: " + xhr.status );    
   



    });

};