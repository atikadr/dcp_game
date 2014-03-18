

function returnPowerUpType(points){
	switch (points){
		case 0: return null; break;
		case 10: return {_type: "multiplier random", level: 1}; break;
		case 20: return {_type: "multiplier", level: 1}; break;
		case 30: return {_type: "hit box", level: 1}; break;
		case 40: return {_type: "multiplier random", level: 2}; break;
		case 50: return {_type: "multiplier", level: 2}; break;
		case 60: return {_type: "hit box", level: 2}; break;
		case 70: return {_type: "multiplier random", level: 3}; break;
		case 80: return {_type: "multiplier", level: 3}; break;
		case 90: return {_type: "hit box", level: 3}; break;
	}
}

function manipulateBeat(powerUp, level, beatArray){

}

var computeTrack = function(track, points){
	//var multiplierType = returnPowerUpType(points);

	//for testing
	var multiplierType = returnPowerUpType(20);
	var beats = track.split(';');
	for (var i=0 ; i < beats.length ; i++){
		var aBeat = beats[i].split(',');
		
		//treat the beat accordingly
		switch (multiplierType._type) {
			case "multiplier":
				if (multiplierType.level == 1)
					aBeat[2] = aBeat[2] * 2;
				if (multiplierType.level == 2)
					aBeat[2] = aBeat[2] * 3;
				if (multiplierType.level == 3)
					aBeat[2] = aBeat[2] * 4;
				break;
			case "multiplier random":
				var probability = Math.random();
				if (multiplierType.level == 1)
					if (probability < 0.3)
						aBeat[2] = aBeat[2] * 2;
				if (multiplierType.level == 2)
					if (probability < 0.5)
						aBeat[2] = aBeat[2] * 3;
				if (multiplierType.level == 3)
					if (probability < 0.8)
						aBeat[2] = aBeat[2] * 4;
				break;	
		}

		//concatenate the colour, time, and points back
		beats[i] = aBeat[0] + "," + aBeat[1] + "," + aBeat[2];
	}

	//concatenate the beats back into a string
	var finalBeats = "";
	for (var i = 0 ; i < beats.length ; i++)
		finalBeats +=  beats[i] + ";";

	return finalBeats;
}

exports.computeTrack = computeTrack;