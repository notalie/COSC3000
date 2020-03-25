
function drawBarChart(stateData, presets, chartTitle, iconsOn) {
    stateData.unshift(presets);
    // Show the top 10 characters
    stateData.splice(11);
    var charNames = []
    if (iconsOn) {
        for (var i = 1; i < stateData.length; i++) {
            charNames.push(stateData[i][0]);
            stateData[i][0] = "";
        }
    }


    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawChart);
    
    function drawChart() {
      var data = google.visualization.arrayToDataTable(
        stateData
      );

      var view = new google.visualization.DataView(data);
      view.setColumns([0, 1,
                       { calc: "stringify",
                         sourceColumn: 1,
                         type: "string",
                         role: "annotation" },
                       2]);

      var options = {
        title: chartTitle,
        width: 1200,
        height: 600,
        bar: {groupWidth: "75%"},
        legend: { position: "none" },
      };
      var chart = new google.visualization.BarChart(document.getElementById("elo-chart"));
      chart.draw(view, options);

      if (iconsOn) {
        for (var i = 0; i < charNames.length; i++) {
            $("#icons")[0].innerHTML += '<li> <img src="'+ ICONS[charNames[i]]  + '"</img> </li>';
        }
    }
  }
}
// Compares Player Numbers
function Comparator(a, b) {
    if (a[1] > b[1]) return -1;
    if (a[1] < b[1]) return 1;
    return 0;
}
var chosenState;

// Redraw the Bar Graph 
function barGraphClick(elem) {
    if (chosenState !== undefined) {
        $(chosenState).css("color", "grey");
    }
    chosenState = $(elem);
    $(chosenState).css("color", "black");
    $("#icons")[0].innerHTML = '';
    var data = stateData;
    var state = data["Q1"][chosenState[0].innerHTML];
    var overallData = []

    for (var character in state) {
        var charData = []
        charData.push(character);
        charData.push(state[character][0].length);
        charData.push(COLOURS[character]);
        overallData.push(charData);
    }
    overallData = overallData.sort(Comparator);
    drawBarChart(overallData, ["Element", "Players", { role: "style" } ], "Character Usage in Q1 " + chosenState[0].innerHTML, true);
}


$(document).ready(function() {
    barGraphClick($("#states li")[1]);

    // Change the State of the Bar Graph
    $('#states li').click(function() {
        barGraphClick($(this))
    });



});


