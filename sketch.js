const MIDDLE_X = 600
const MIDDLE_Y = 300
const WIDTH = 500
const HEIGHT = 500
const NOTCHES = 24

let sunrise;
let sunset;
let http;


function setup() {
	createCanvas(1200,600); // make an HTML canvas element width x height pixels
	background(225);
	http = new XMLHttpRequest();
	const url = "https://api.sunrise-sunset.org/json?lat=40.712772&lng=-74.006058&date=today";
	http.open("GET", url);
	http.send();
	http.onreadystatechange = function() {
		if (this.status==200) {
			response = JSON.parse(http.responseText);
			console.log(response)
			sunrise = parseAndConvertUTCTimeString(response["results"]["sunrise"]);
			sunset = parseAndConvertUTCTimeString(response["results"]["sunset"]);
			console.log("sunrise="+ sunrise);
			console.log("sunset=" + sunset);
		}
	}
	frameRate(1);

}

function parseAndConvertUTCTimeString(timeString) {
	hours = parseInt(timeString.split(":")[0])
	whenish = timeString.substring(timeString.length - 2, timeString.length);
	if (whenish == "PM" && hours != 12) {
		hours += 12;
	}
	// convert
	hours = hours - 5;
	minutes = parseInt(timeString.split(":")[1].substring(0,1));
	return hours*60+minutes;
	
}


function draw() {
	drawClock();
	drawCenter();
	drawSun();
	if (second() == 0) {
		console.log(hour() + "h " + minute() + "min");
	}
}

function drawClock() {
	fill(111, 143, 175);
	noStroke();

	let sunriseArc = (sunrise/1440)*TWO_PI + HALF_PI;
	let sunsetArc = sunset / 1440*TWO_PI + HALF_PI;
	// console.log(sunriseArc);
	// console.log(sunsetArc);
	arc(MIDDLE_X, MIDDLE_Y, WIDTH, HEIGHT, sunsetArc, sunriseArc, PIE);
	// ellipse(MIDDLE_X, MIDDLE_Y, WIDTH, HEIGHT);
	let labels = ["0", "21", "18", "15", "12", "9", "6", "3"];
	for (let i = 0; i < NOTCHES; i++) {
		r = i*TWO_PI/NOTCHES;	
		var x = MIDDLE_X + (WIDTH/2) * sin(r) ;
		var y = MIDDLE_Y + (HEIGHT/2) * cos(r);
		if (i % 3 == 0) {
			fill(255, 255, 255);
			circle(x, y, 25);
			fill(0, 0, 0);
			textFont('Monaco');
			if (labels[i/3].length == 2) {
				text(labels[i/3], x-7, y+4);
			} else {
				text(labels[i/3], x-5, y+4);
			}
		} else {
			fill(0, 0, 0);
			circle(x, y, 5)
		}
	}

}


function drawCenter() {
	fill(111);
	circle(MIDDLE_X, MIDDLE_Y, 100);
}

function drawSun() {
	let c = color(255, 204, 0);
	fill(c);
	noStroke();

	s = second();
	h = hour();
	m = minute();
	t = (h*60 + m) / 1440*TWO_PI ;
	var x = MIDDLE_X + (WIDTH/2) * -1*sin(t) ;
	var y = MIDDLE_Y + (HEIGHT/2) * cos(t);
	circle(x, y, 40);
}
