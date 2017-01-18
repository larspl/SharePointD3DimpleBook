function processChart(whatever) {
    function setupChart(BurnDown) {
        var SprintStart;
        var SprintEnd;

        //Remove Prior Run
        $('svg').remove();
        $('#buttonControls').remove();
        $('#buttonToggleContainer').remove();


        var BurnDownText;
        var BundDownCommand;
        if (BurnDown) {
            BurnDownText = "Sprint Comparison by Day BurnDown Chart";
            BurnDownCommand = "BurnUp";
        } else {
            BurnDownText = "Sprint Comparison by Day BurnUp Chart";
            BurnDownCommand = "BurnDown";
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
            .html(BurnDownText);

        table = buttonToggleContainer.append('table')
            .attr("id", "tblCommands");
        tr = table.append("tr")
            .attr("id", "secondRow");

        td = tr.append("td")
            .classed("ctrltd", true);

        td.append("button")
            .attr("id", "btnToggleBurnDown")
            .attr("title", "BurnDown/BurnUp Toggle")
            .html(BurnDownCommand)
            .on("click", onToggleBurnDownClick);

        var svg = dimple.newSvg("#dimpleChartContainer");


        whateverruncycle = dimple.filterData(whatever, "runcycle", ["Prod"])
        console.log(whateverruncycle);

        var myChart = new dimple.chart(svg, whateverruncycle);
        myChart.setBounds(100, 50, 600, 430);

        // Add your x axis - nothing unusual here
        var x = myChart.addCategoryAxis("x", "Day");
        x.addOrderRule("Day");

        // y axis changes for burndown and burnup
        if (BurnDown) {
            var y = myChart.addMeasureAxis("y", "Remaining Hours");
        } else {
            var y = myChart.addMeasureAxis("y", "Burned Hours Accumulator");
        }

        y.showGridlines = true;
        y.tickFormat = "d";
        x.showGridlines = true;


        var lines = myChart.addSeries("sprint", dimple.plot.line, [x, y]);

        // Do a bit of styling to make it look nicer
        lines.lineMarkers = true;
        lines.lineWeight = 3;


        var myLegend = myChart.addLegend(650, 50, 60, 800, "Right");

        myChart.draw(2000);

        var tmpText;
        if (BurnDown) {
            tmpText = "BurnDown Chart for Sprint: ";
        } else {
            tmpText = "Burnup Chart for Sprint: ";
        }


        function onToggleBurnDownClick(e) {
            if (BurnDown) {
                BurnDown = 0;
            } else {
                BurnDown = 1;
            }
            setupChart(BurnDown);
        };


    };

    setupChart( );

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
        //alert("Got Data");

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
                    "sprintday": SprintDay,
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
                "sprintday": SprintDay,
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

       
        processChart(myData);




    }, function(data) {
        alert("Ooops, an error occured. Please try again");




    });

};