function drawIt(dataToUse, location, chartTitle) {
    dataToUse.unshift(['ID', 'Amount of Registered Players', 'Elo Gain', 'Region',     'Radius']);
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        var data = google.visualization.arrayToDataTable(
            dataToUse
        );
    
          var options = {
            title: chartTitle,
            hAxis: {title: 'Amount of Registered Players', maxValue:300},
            vAxis: {title: 'Elo Gain', maxValue:150000},
            bubble: {textStyle: {fontSize: 11}},
            explorer: { keepInBounds: true }
        };
    
          var chart = new google.visualization.BubbleChart(document.getElementById(location));
          chart.draw(data, options);
    }
}


function sortData() {
    var overallData = [];
    var QUARTERS = ["Q1", "Q2", "Q3", "Q4"];
    var stateList = ["QLD", "NSW", "VIC", "SA", "ACT", "NZ", "WA"];
    for (var i = 0; i < QUARTERS.length; i++) {
        var currentQuarter = QUARTERS[i];
        for (var j = 0; j < stateList.length; j++) {
            var currentState = stateList[j];
            var quarterData = []
            var eloGain = 0
            var playerList = [];
            var totalPlayers = 0;
            for (var k = 0; k < CHARACTERS.length; k++) {
                var currentChar = CHARACTERS[k];
                if (stateData[currentQuarter][currentState][currentChar] !== undefined) {
                    eloGain += stateData[currentQuarter][currentState][currentChar][1];
                    for (var o = 0; o < stateData[currentQuarter][currentState][currentChar][0].length; o++) {
                        if (!playerList.includes(stateData[currentQuarter][currentState][currentChar][0][o])) {
                            playerList.push(stateData[currentQuarter][currentState][currentChar][0][o])
                        }
                    }
                }
            }
            quarterData.push(stateList[j], playerList.length, eloGain, QUARTERS[i], 1);
            overallData.push(quarterData);
        }
    }
    return overallData;
}


function sortData2() {
    var overallData = [];
    var QUARTERS = ["Q1", "Q2", "Q3", "Q4"];
    var stateList = ["QLD", "NSW", "VIC", "SA", "ACT", "NZ", "WA"];
    for (var i = 0; i < QUARTERS.length; i++) {
        var currentQuarter = QUARTERS[i];
        for (var j = 0; j < stateList.length; j++) {
            var currentState = stateList[j];
            var quarterData = []
            var eloGain = 0
            var totalPlayers = 0;
            var playerList = []
            for (var k = 0; k < CHARACTERS.length; k++) {
                var currentChar = CHARACTERS[k];
                if (stateData[currentQuarter][currentState][currentChar] !== undefined) {
                    eloGain += stateData[currentQuarter][currentState][currentChar][1];
                    for (var o = 0; o < stateData[currentQuarter][currentState][currentChar][0].length; o++) {
                        if (!playerList.includes(stateData[currentQuarter][currentState][currentChar][0][o])) {
                            playerList.push(stateData[currentQuarter][currentState][currentChar][0][o])
                        }
                    }
                }
            }
            quarterData.push(stateList[j], playerList.length, eloGain, "A", 1);
            overallData.push(quarterData);
        }
    }
    return overallData;
}
//ID', 'Amount of Unique Players', 'Elo Gain', 'Region',     'Radius']);
$(document).ready(function() {
    var data = sortData();
    data.push(['QLD', 0,0,"Q4", 2])
    drawIt(data, 'main-chart', 'Correlation Between the Amount of Registered Players in the State and the Amount of Elo Gained per Quarter');

    data = sortData();
    drawIt(data, 'main-chart1.5', 'Correlation Between the Amount of Registered Players in the State and the Amount of Elo Gained per Quarter')

    var data2 = sortData2();
    data2.push(['QLD', 0,0,"A", 2])
    drawIt(data2, 'main-chart2', 'Correlation Between the Amount of Registered Players and the Amount of Elo Gained for the whole of Australia');
});