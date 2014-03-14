

function returnPowerUpType(points){
	switch (points){
		case 0: return null; break;
		case 10: return {type: "multiplier random", level: 1}; break;
		case 20: return {type: "multiplier", level: 1}; break;
		case 30: return {type: "hit box", level: 1}; break;
		case 40: return {type: "multiplier random", level: 2}; break;
		case 50: return {type: "multiplier", level: 2}; break;
		case 60: return {type: "hit box", level: 2}; break;
		case 70: return {type: "multiplier random", level: 3}; break;
		case 80: return {type: "multiplier", level: 3}; break;
		case 90: return {type: "hit box", level: 3}; break;
	}
}

function manipulateBeat(powerUp, level, beatArray){

}

var computeTrack = function(track, mysql){
	/*
	mysql.query('select points from Player where fbid = "' + fbid + '";', function(err, result, fields){
		if (err) throw err;
		else{
			returnPowerUpType(result[0]);
			}
		});
*/
}

exports.computeTrack = computeTrack;