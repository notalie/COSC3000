function drawStepChart(dataToParse, chartTitle) {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = google.visualization.arrayToDataTable(
            dataToParse
        );

        var options = {
            title: chartTitle,
            vAxis: {title: 'Collective Matches Played'},
            isStacked: true,
            hAxis: {
                title: 'State'
            },
            
        };

        var chart = new google.visualization.SteppedAreaChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    }
}

function getMatchesPlayedPerState() {
    var overallData = [];
    overallData.push(["State", "Q1", "Q2", "Q3", "Q4"])
    for (var j in STATES) {
    var currentState = STATES[j];
    var currentStateData = [];
    currentStateData.push(currentState)
        for (var i in QUARTERS) {
            var matchesPlayed = 0;
            var currentQuarter = QUARTERS[i];
            for (var k in CHARACTERS) {
                var currentCharacter = CHARACTERS[k];
                if (stateData[currentQuarter][currentState][currentCharacter] !== undefined) {
                    matchesPlayed += stateData[currentQuarter][currentState][currentCharacter][2];
                }
            }
            currentStateData.push(matchesPlayed);
        }
        overallData.push(currentStateData);
    }
    return overallData;
}

$(document).ready(function() {
    var d = getMatchesPlayedPerState();
    console.log(d);
    drawStepChart(d, "Matches Played Per State");



});