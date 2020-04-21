function drawIt(dataToUse, location, chartTitle, numToSplice, restrictions) {
    dataToUse.unshift(['Character Name', 'Tournaments Entered', 'Elo Gain', 'Quarter',  'Unique Players']);
    dataToUse.splice(numToSplice);
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        var data = google.visualization.arrayToDataTable(
            dataToUse
        );
    
          var options = {
            title: chartTitle,
            hAxis: {title: 'Tournaments Entered', maxValue:restrictions[0]},
            vAxis: {title: 'Elo Gained', maxValue:restrictions[1]},
            bubble: {textStyle: {fontSize: 11}},
            explorer: { keepInBounds: true },
        };
    
          var chart = new google.visualization.BubbleChart(document.getElementById(location));
          chart.draw(data, options);
    }
}

function drawColourGraph(dataToUse, location, chartTitle, numToSplice, restrictions) {
    dataToUse.unshift(['Character Name', 'Tournaments Entered', 'Elo Gain', 'Quarter',  'Unique Players']);
    dataToUse.splice(numToSplice);
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    for (var i = 0; i < numToSplice; i++) {
        dataToUse[i].splice(3, 1);
    }
    function drawChart() {
        var data = google.visualization.arrayToDataTable(
            dataToUse
        );
        console.log(dataToUse)
          var options = {
            title: chartTitle,
            hAxis: {title: 'Tournaments Entered', maxValue:restrictions[0]},
            vAxis: {title: 'Elo Gained', maxValue:restrictions[1]},
            bubble: {textStyle: {fontSize: 11}},
            explorer: { keepInBounds: true },
            colorAxis: {
                colors: ['yellow', 'red'],
                minValue: restrictions[2],
                maxValue:restrictions[3]
            }
        };
    
          var chart = new google.visualization.BubbleChart(document.getElementById(location));
          chart.draw(data, options);
    }
    
}

function Comparator(a, b) {
    if (a[4] > b[4]) return -1;
    if (a[4] < b[4]) return 1;
    return 0;
}

// Char name, x, y, quarter, radius
// char name, tournaments entered, elo gained, quarter, player size
function getQuarterlyData() {
    var overallData = [];
    var QUARTERS = ["Q1", "Q2", "Q3", "Q4"];
    var STATES = ["QLD", "NSW", "VIC", "SA", "ACT", "NZ", "WA"];
    for (var i in CHARACTERS) {
        var currentChar = CHARACTERS[i]
        
        for (var j in QUARTERS) {
            var totalPlayers = 0;
            var totalEloGain = 0;
            var totalTourneysEntered = 0
            var currentQuarter = QUARTERS[j];
            for (var s in STATES) {
                var currentState = STATES[s];
                
                if (stateData[currentQuarter][currentState][currentChar] !== undefined) {
                    totalTourneysEntered += stateData[currentQuarter][currentState][currentChar][2];
                    totalEloGain += stateData[currentQuarter][currentState][currentChar][1];
                    totalPlayers += stateData[currentQuarter][currentState][currentChar][0].length;
                }
            }
            overallData.push([currentChar + "(" + currentQuarter + ")", totalTourneysEntered, totalEloGain, currentQuarter, totalPlayers]);
        }
    }
    return overallData;
}

function getYearlyData() {
    var overallData = [];
    var QUARTERS = ["Q1", "Q2", "Q3", "Q4"];
    var STATES = ["QLD", "NSW", "VIC", "SA", "ACT", "NZ", "WA"];
    for (var i in CHARACTERS) {
        var currentChar = CHARACTERS[i]
        var totalPlayers = 0;
        var totalEloGain = 0;
        var totalTourneysEntered = 0
        for (var j in QUARTERS) {
            var currentQuarter = QUARTERS[j];
            for (var s in STATES) {
                var currentState = STATES[s];
                
                if (stateData[currentQuarter][currentState][currentChar] !== undefined) {
                    totalTourneysEntered += stateData[currentQuarter][currentState][currentChar][2];
                    totalEloGain += stateData[currentQuarter][currentState][currentChar][1];
                    totalPlayers += stateData[currentQuarter][currentState][currentChar][0].length;
                }
            }
        }
        overallData.push([currentChar, totalTourneysEntered, totalEloGain, "a", totalPlayers]);
    }
    return overallData;
}


$(document).ready(function() {


    var yearData = getYearlyData();
    drawIt(yearData, "year-bubble-chart", "Character Usage and Data Throughout 2019", yearData.length, [3600,75000]);
    yearData = getYearlyData().sort(Comparator);
    drawColourGraph(yearData, "year-better-bubble-chart", "The Top 25 Most Used Characters in 2019", 26,[3700,80000,100,350]);

    var resultData = getQuarterlyData();
    drawIt(resultData, "quarter-bubble-chart", "Character Usage and Data Throughout Each Quarter of 2019", resultData.length, [1200,30000]);
    resultData = getQuarterlyData().sort(Comparator);
    drawColourGraph(resultData, "quarter-better-bubble-chart", "The Top 25 Most Used Characters in 2019 (Quarters Included)", 26, [1200,30000, 60,100]);

});