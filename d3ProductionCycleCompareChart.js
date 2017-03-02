function processChart(whatever) 
{
    function setupChart(RampUp) {
    
        //Remove Prior Run
        $('svg').remove();
        $('#buttonControls').remove();
        $('#buttonToggleContainer').remove();

        var RampUpText;
        var BundDownCommand;
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

        //Setup Button for RampUp Toggle
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

        var svg = dimple.newSvg("#dimpleChartContainer");

        whateverRunType = dimple.filterData(whatever, "Run Type", ["Prod"])
        console.log(whateverRunType);

        var myChart = new dimple.chart(svg, whateverRunType);
        myChart.setBounds(100, 50, 600, 430);

        // Add your x axis - nothing unusual here
        var x = myChart.addCategoryAxis("x", "Cycle Day Nbr");
        x.addOrderRule("Cycle Day Nbr");

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
     
  	function getResourceData(){
		   
		processChart(myData);
				
				//console.log(myData);

	};
	


	
