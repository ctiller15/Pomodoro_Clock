var lengthObj = {
	sessionLength: 25,
	breakLength: 5,
	curSessTime: 0,
	curBreakTime: 0
};

var onBreak = false;
var isRunning = false;
var paused = false;

var sessSect = document.querySelector(".session");
var breakSect = document.querySelector(".break");

var decreaseButtons = document.querySelectorAll(".dec");
var increaseButtons = document.querySelectorAll(".inc");

var sessTimer = document.querySelector(".sessTimer");
var breakTimer = document.querySelector(".breakTimer");
var start = document.querySelector(".start");
var pause = document.querySelector(".pause");
// create a function that when called, increases the value.
// It should update a desired element.

var increment = (obj, key, varName) => {
	if (obj[key] < 50) {
		obj[key] += 1;
	}
	varName.textContent = obj[key];
}

// create a function that when called, decreases a value.

var decrement = (obj, key, varName) => {
	if (obj[key] > 1) {
		obj[key] -= 1;
	}
	varName.textContent = obj[key];	
}

var primeButtons = (index, key, section ) => {
	decreaseButtons[index].addEventListener("click", () => {
		decrement(lengthObj, key, section);
		if(key === "sessionLength"){
			sessTimer.textContent = lengthObj.sessionLength;
		}
	});

	increaseButtons[index].addEventListener("click", () => {
		increment(lengthObj, key, section);
		if(key === "sessionLength"){
			sessTimer.textContent = lengthObj.sessionLength;
		}
	});
}

// Both values must always be 1 or greater.

// a basic function using setTimeout to count down for us.
var sessCountDown = (msSess, msBreak) => {
	//debugger;
	isRunning = true;
	if(!onBreak){
		var decreasedTime = msSess - 1000;
		lengthObj.curSessTime = msSess;
		let minutes = Math.floor(msSess / 60000);
		let seconds = (msSess - (minutes * 60000))/1000;
		let currentTime = clockTime(minutes, seconds);
		console.log(currentTime);
		sessTimer.textContent = currentTime;
		if(msSess > 0){
			// defining the timer on the object so I have access to it outside
			// of the function scope.
			lengthObj.timeLeft = setTimeout(() => {
				sessCountDown(decreasedTime, msBreak);
			}, 1000);
		} else {
			console.log("Timer has completed! Break time!");
			onBreak = true;
			// once this section is reached, the break begins!
			breakCountDown(msBreak);
		}
	} 
}

var breakCountDown = (msBreak) => {
	if(onBreak) {
		// Now that we're on break, we can run the break timer.
		var decreasedTime = msBreak - 1000;
		lengthObj.curBreakTime = msBreak;
		console.log(msBreak);
		let minutes = Math.floor(msBreak / 60000);
		let seconds = (msBreak - (minutes * 60000))/1000;
		let currentTime = clockTime(minutes, seconds);
		breakTimer.textContent = currentTime;
		if(msBreak > 0){
			lengthObj.timeLeft = setTimeout( () => {
				breakCountDown(decreasedTime);
			}, 1000);
		} else {
			console.log("Timer has finished! Break over!");
			onBreak = false;
			isRunning = false;
		}
	}
}

var clockTime = (mins, secs) => {
	if(secs >= 10){
		return mins + ":" + secs;
	} else if(secs < 10) {
		return mins + ":0" + secs;
	}
}

// initializing the display.
sessSect.textContent = lengthObj.sessionLength;
breakSect.textContent = lengthObj.breakLength;

// index 0 refers to the "break" buttons, while
// index 1 refers to the "session" buttons.
// Couldn't really think of a way to make this one nicer.

primeButtons(0, "breakLength", breakSect);

primeButtons(1, "sessionLength", sessSect);

start.addEventListener("click", () => {
	clearTimeout(lengthObj.timeLeft);
	paused = false;
	start.textContent = "reset";
	breakTimer.textContent = `${lengthObj.breakLength}:00`;
	sessCountDown(lengthObj.sessionLength * 60 * 1000, lengthObj.breakLength * 60 * 1000);
});

pause.addEventListener("click", () => {
	// if not paused, it stores the current value of all given variables.
	if(!paused){
		console.log("pausing");
		clearTimeout(lengthObj.timeLeft);
		// The case where we're still on the main session.
		// We store the current time into the lengthObj object.
		// if(!onBreak){
		// 	lengthObj.curSessTime = sessTimer.textContent;
		// 	console.log(lengthObj.curSessTime);
		// } else if(onBreak){
		// 	// storing the current time into curBreakTime;
		// 	lengthObj.curBreakTime = breakTimer.textContent;
		// 	console.log(breakObj.curBreakTime);
		// }
	} else if(paused){
		// if currently paused, it resumes with the currently stored variable.
		console.log("resuming");
		if(!onBreak){
			sessCountDown(lengthObj.curSessTime);
		} else if(onBreak){
			breakCountDown(lengthObj.curBreakTime);
		}
	}
	paused = !paused;
});