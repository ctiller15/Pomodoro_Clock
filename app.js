// handler object

var timeObj = {
	sessionLength: 25,
	breakLength: 5,
	curSessTime: 0,
	curBreakTime: 0,
	timerHeight: 0
};

// state variables
var onBreak = false;
var isRunning = false;
var paused = false;


// selecting sections with respective bars.
var sessSect = document.querySelector(".session");
var sessBar = document.querySelector(".sessBar");
var breakSect = document.querySelector(".break");
var breakBar = document.querySelector(".breakBar")

// selecting buttons
var decreaseButtons = document.querySelectorAll(".dec");
var increaseButtons = document.querySelectorAll(".inc");

// selecting the timers, the start, and pause buttons.
var timer = document.querySelector(".timer");
var sessTimer = document.querySelector(".sessTimer");
var sessTime = document.querySelector(".sessTime");
var breakTimer = document.querySelector(".breakTimer");
var breakTime = document.querySelector(".breakTimeLeft");
var start = document.querySelector(".start");
var pause = document.querySelector(".pause");


// When called, increases value
var increment = (obj, key, varName) => {
	if (obj[key] < 50) {
		obj[key] += 1;
	}
	varName.textContent = obj[key];
}

//when called, decreases a value.
var decrement = (obj, key, varName) => {
	if (obj[key] > 1) {
		obj[key] -= 1;
	}
	varName.textContent = obj[key];	
}

// prepares the buttons to get used.
var primeButtons = (index, key, section ) => {
	decreaseButtons[index].addEventListener("click", () => {
		decrement(timeObj, key, section);
		// checkKeyAndUpdate(key);
	});

	increaseButtons[index].addEventListener("click", () => {
		increment(timeObj, key, section);
		// checkKeyAndUpdate(key);
	});
}

// a basic function using setTimeout to count down for us.
var sessCountDown = (msSess, msBreak) => {
	isRunning = true;
	if(!onBreak){
		sessBar.style.height = `${((msSess / timeObj.timerHeight) * 100).toFixed(2)}%`;
		var decreasedTime = runClock(msSess, sessBar, timer, "curSessTime");
		if(msSess > 0){
			// defining the timer on the object so I have access to it outside of the function scope.
			timeObj.timeLeft = setTimeout(() => {
				sessCountDown(decreasedTime, msBreak);
			}, 1000);
		} else {
			console.log("Timer has completed! Break time!");
			onBreak = true;
			// once this section is reached, the break begins!
			timeObj.timerHeight = msBreak;
			breakCountDown(msBreak);
		}
	} 
}

// similar to the other one. Counts down for the other timer.
var breakCountDown = (msBreak) => {
	if(onBreak) {
		breakBar.style.height = `${((1.00 - (msBreak / timeObj.timerHeight)) * 100).toFixed(2)}%`;
		console.log(breakBar.style.height);
		// Now that we're on break, we can run the break timer.
		var decreasedTime = runClock(msBreak, breakBar, timer, "curbreakTime");
		if(msBreak > 0){
			timeObj.timeLeft = setTimeout( () => {
				breakCountDown(decreasedTime);
			}, 1000);
		} else {
			console.log("Timer has finished! Break over!");
			onBreak = false;
			isRunning = false;
		}
	}
}

var runClock = (msTime, bar, timer, timeKey) => {
	
	var decreasedTime = msTime - 1000;
	timeObj[timeKey] = msTime;
	let minutes = Math.floor(msTime / 60000);
	let seconds = (msTime - (minutes * 60000))/1000;
	let currentTime = clockTime(minutes, seconds);
	timer.textContent = currentTime;
	return decreasedTime;
}

var clockTime = (mins, secs) => {
	if(secs >= 10){
		return mins + ":" + secs;
	} else if(secs < 10) {
		return mins + ":0" + secs;
	}
}

// initializing the display.
sessSect.textContent = timeObj.sessionLength;
breakSect.textContent = timeObj.breakLength;

// index 0 refers to the "break" buttons, while
// index 1 refers to the "session" buttons.
// Couldn't really think of a way to make this one nicer.

primeButtons(0, "breakLength", breakSect);

primeButtons(1, "sessionLength", sessSect);

// It can function as both a pause and a reset button.
start.addEventListener("click", () => {
	breakBar.style.height = "0%";
	timeObj.timerHeight = timeObj.sessionLength * 60 * 1000;
	clearTimeout(timeObj.timeLeft);
	paused = false;
	start.innerHTML = '<i class="fa fa-refresh" aria-hidden="true"></i>';
	onBreak = false;
	sessCountDown(timeObj.sessionLength * 60 * 1000, timeObj.breakLength * 60 * 1000);
});

pause.addEventListener("click", () => {
	// if not paused, it stores the current value of all given variables.
	if(!paused){
		console.log("pausing");
		clearTimeout(timeObj.timeLeft);
		pause.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
	} else if(paused){
		// if currently paused, it resumes with the currently stored variable.
		console.log("resuming");
		if(!onBreak){
			sessCountDown(timeObj.curSessTime);
		} else if(onBreak){
			breakCountDown(timeObj.curBreakTime);
		}
		pause.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
	}
	paused = !paused;
});