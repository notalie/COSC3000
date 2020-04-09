
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
		width: 1800,
		height: 800,
		bar: {groupWidth: "80%"},
		legend: { position: "none" },
		vAxis: {
			title: 'Characters'
		},
		hAxis: {
			title: 'Amount of Unique Players'
		}
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
var chosenQuarter = "Q1"
var icons = true;

var QUARTERS = ["Q1", "Q2", "Q3", "Q4"]

function showTotalPlayers() {

	var overallData = [];
	overallData.push(["State", "Players", { role: "style" } ]);

	for (var i = 0; i < stateList.length; i++) {
		var playerList = []
		var stateInfo = []
		var currentState = stateList[i];
        for (var j = 0; j < QUARTERS.length; j++) {
			var currentQuarter = QUARTERS[j];
            for (var k = 0; k < CHARACTERS.length; k++) {
                var currentChar = CHARACTERS[k];
				
				if (stateData[currentQuarter][currentState][currentChar] !== undefined) {
                    for (var o = 0; o < stateData[currentQuarter][currentState][currentChar][0].length; o++) {
                        if (!playerList.includes(stateData[currentQuarter][currentState][currentChar][0][o])) {
                            playerList.push(stateData[currentQuarter][currentState][currentChar][0][o])
                        }
                    }
                }
			}
		}
		stateInfo.push(currentState, playerList.length, STATE_COLOURS[currentState]);
		overallData.push(stateInfo);
		
	}

	overallData = overallData.sort(Comparator);

	google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawChart);
	function drawChart() {
		var data = google.visualization.arrayToDataTable(
			overallData
		);

		var view = new google.visualization.DataView(data);
		view.setColumns([0, 1,
						{ calc: "stringify",
							sourceColumn: 1,
							type: "string",
							role: "annotation" },
						2]);

		var options = {
			title: "The Amount of Total Registered Players in Each State",
			width: 1800,
			height: 800,
			bar: {groupWidth: "80%"},
			legend: { position: "none" },
			vAxis: {
				title: 'States'
			},
			hAxis: {
				title: 'Amount of Unique Players'
			}
		};

		var chart = new google.visualization.BarChart(document.getElementById("player-chart"));
		chart.draw(view, options);
	}
}


var stateList = ["QLD", "NSW", "TAS", "VIC", "SA", "ACT", "NZ", "WA", "INT"];
// Redraw the Bar Graph 
function barGraphClick(elem) {
    if (chosenState !== undefined) {
        $(chosenState).css("color", "grey");
    }
    chosenState = $(elem);
    $(chosenState).css("color", "black");
    $("#icons")[0].innerHTML = '';
	var data = stateData;
    if (chosenState[0].innerHTML == "ALL") {
		var overallData = [];
		for (var i = 0 ; i < CHARACTERS.length; i++) {
			var charData = []
			var totalPlayers = 0;
			for (var j = 0 ; j < stateList.length; j++) {
				var stateName = stateList[j];
				if (data[chosenQuarter][stateName][CHARACTERS[i]] !== undefined) {
					totalPlayers += data[chosenQuarter][stateName][CHARACTERS[i]][0].length;
				}
			}
			charData.push(CHARACTERS[i]);
			charData.push(totalPlayers);
			charData.push(COLOURS[CHARACTERS[i]]);
			overallData.push(charData);
		}
		overallData = overallData.sort(Comparator);
		drawBarChart(overallData, ["Element", "Players", { role: "style" } ], "Character Usage in ALL states in " + chosenQuarter, icons);

    } else {
		var state = data[chosenQuarter][chosenState[0].innerHTML];
		var overallData = [];
		for (var character in state) {
		var charData = []
		charData.push(character);
		charData.push(state[character][0].length);
		charData.push(COLOURS[character]);
		overallData.push(charData);
		}
		overallData = overallData.sort(Comparator);
		drawBarChart(overallData, ["Element", "Players", { role: "style" } ], "Character Usage in " + chosenQuarter + " " + chosenState[0].innerHTML, icons);
    }
    
}


$(document).ready(function() {



	$("#iconSwitch").click(function(event) {
		
		icons = !(($("#iconSwitch")[0]['checked']) == true);
		barGraphClick(chosenState);
		if (icons) {
			$("#iconInfo")[0].innerHTML = "Icons are on";
		} else {
			$("#iconInfo")[0].innerHTML = "Icons are off";
		}
	});


	// Default QLD on load, might need to change it for later
	for (var i = 0; i < $("#quarters li").length; i++) {
		$($("#quarters li")[i]).css("color", "grey");
	}
	$($("#quarters li")[0]).css("color", "black");
	barGraphClick($("#states li")[0]);

    // Change the State of the Bar Graph
    $('#states li').click(function() {
        barGraphClick($(this))
	});
	
	$('#quarters li').click(function() {
		chosenQuarter = $(this)[0].innerHTML;
		for (var i = 0; i < $("#quarters li").length; i++) {
			if ($("#quarters li")[i].innerHTML == chosenQuarter) {
				$($("#quarters li")[i]).css("color", "black");
			} else {
				$($("#quarters li")[i]).css("color", "grey");
			}
			
		}
		
        barGraphClick(chosenState)
    });
	showTotalPlayers()
});


